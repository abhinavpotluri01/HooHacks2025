import os
import base64
import random
import mimetypes
import tempfile
import json
from imgur import upload_to_imgur
from dotenv import load_dotenv
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from google import genai
from google.genai import types


from ipipeline import run_pipeline

load_dotenv()

os.makedirs("gen_images", exist_ok=True)

app = Flask(__name__)
CORS(app)


# -----------------------------------------------------------------------------
# HELPER FUNCTIONS (unchanged except for removing extraneous prints / SSE calls)
# -----------------------------------------------------------------------------

def create_genai_client(api_key):
    return genai.Client(api_key=api_key)

def get_valid_seed(allowed_seeds, blocked_seeds=None):
    if blocked_seeds is None:
        blocked_seeds = []
    valid_options = [s for s in allowed_seeds if s not in blocked_seeds]
    if not valid_options:
        raise ValueError("No valid seeds remain after excluding blocked seeds.")
    return random.choice(valid_options)

def upload_files(client, file_paths):
    uploaded = []
    for path in file_paths:
        uploaded_file = client.files.upload(file=path)
        uploaded.append(uploaded_file)
    return uploaded

def create_generate_content_config(seed, response_modalities=("text",)):
    return types.GenerateContentConfig(
        seed=seed,
        temperature=1,
        top_p=0.9,
        response_modalities=list(response_modalities),
        safety_settings=[
            types.SafetySetting(
                category="HARM_CATEGORY_CIVIC_INTEGRITY",
                threshold="OFF",
            ),
        ],
        response_mime_type="text/plain",
    )

def save_binary_file(file_name, data):
    with open(file_name, "wb") as f:
        f.write(data)

def process_output_chunks(stream_result, image_name=None):
    """
    Collect text or inline binary from the streaming result.
    If 'image_name' is provided, we treat inline_data as an image and save it.
    Returns (text, [saved_image_paths]).
    """
    collected_text = []
    saved_images = []

    for chunk in stream_result:
        if not chunk.candidates or not chunk.candidates[0].content:
            continue

        parts = chunk.candidates[0].content.parts
        if not parts:
            continue

        part = parts[0]  # For these examples, we only take the first part
        # If there's inline_data and we requested an image
        if part.inline_data and image_name is not None:
            inline_data = part.inline_data
            file_extension = mimetypes.guess_extension(inline_data.mime_type)
            file_name_with_ext = f"{image_name}{file_extension}"
            save_binary_file(file_name_with_ext, inline_data.data)
            saved_images.append(file_name_with_ext)
        else:
            collected_text.append(chunk.text)

    return "".join(collected_text), saved_images


# -----------------------------------------------------------------------------
# STEP 1: get_outfit_description (Non-stream JSON response)
# -----------------------------------------------------------------------------
def get_outfit_description(client, file_paths, seed=123):
    """
    Simple function to get an outfit description from the model, given an image.
    """
    uploaded_files = upload_files(client, file_paths)
    contents_step1 = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_uri(
                    file_uri=uploaded_files[0].uri,
                    mime_type=uploaded_files[0].mime_type,
                ),
                types.Part.from_text(
                    text="What colors is this guy wearing? And what aesthetic?"
                ),
            ],
        )
    ]
    config_step1 = create_generate_content_config(seed=seed, response_modalities=["text"], aspect_ratio="1:1")
    model_name = "gemini-2.0-flash-exp-image-generation"
    stream_result = client.models.generate_content_stream(
        model=model_name,
        contents=contents_step1,
        config=config_step1,
    )
    outfit_description, _ = process_output_chunks(stream_result)
    return outfit_description.strip()


# -----------------------------------------------------------------------------
# STEP 2A: generate_shoe_image (one iteration)
# -----------------------------------------------------------------------------
def generate_shoe_image(client, seed, outfit_description):
    """
    Given the outfit_description, produce a single shoe concept.
    Returns (shoe_text, [saved_image_paths]).
    """
    contents_step2 = [
        types.Content(
            role="model",
            parts=[types.Part.from_text(text=outfit_description)],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(
                    text=(
                        "Now you are a drip match shoe recommender bot. "
                        "You first output what would be the best shoe description for this guy, "
                        "and then generate an image of it according to the guideline given next. "
                        "Based on the user's current dress sense, generate a high-resolution, "
                        "professional commercial photo of a single shoe that perfectly complements "
                        "the user's current outfit — focusing on a color scheme other than black. "
                        "The shoe's color palette, materials, and overall aesthetic must align with "
                        "and enhance the user’s unique fashion sense; this is top priority. Display "
                        "only one shoe from a clean lateral (side) view, with no humans or body parts "
                        "visible. It should be isolated on a pure white background with crisp, "
                        "well-directed lighting — and no bottom shadow or reflection."
                    )
                ),
            ],
        ),
    ]
    config_step2 = create_generate_content_config(seed=seed, response_modalities=["image", "text"],aspect_ratio="1:1")
    model_name = "gemini-2.0-flash-exp-image-generation"

    prefix = f"gen_images/GENERATED_SHOE_VERSION_{seed}"
    stream_result = client.models.generate_content_stream(
        model=model_name,
        contents=contents_step2,
        config=config_step2,
    )

    shoe_text, images_saved = process_output_chunks(stream_result, prefix)
    return shoe_text.strip(), images_saved


# -----------------------------------------------------------------------------
# STEP 2B: run_discriminator
# -----------------------------------------------------------------------------
def run_discriminator(client, seed, shoe_text, image_file_path):
    """
    Validate the shoe image meets certain guidelines.
    Must return exactly {"valid": true} or {"valid": false}.
    Return True if valid, else False.
    """
    uploaded_files = upload_files(client, [image_file_path])
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_uri(
                    file_uri=uploaded_files[0].uri,
                    mime_type=uploaded_files[0].mime_type
                ),
                types.Part.from_text(
                    text=(
                        "You are an advanced image validator. Evaluate if the attached image meets ALL the following guidelines:\n"
                        "1) Only a single shoe is visible, nothing else.\n"
                        "2) Pure white background.\n"
                        "3) No humans or body parts visible.\n"
                        "4) Is not a photo of someone wearing a shoe\n"
                        "If it violates any of these guidelines, respond with exactly:\n"
                        '{"valid": false}\n'
                        "Otherwise respond with exactly:\n"
                        '{"valid": true}\n'
                        "No extra text or explanation."
                    )
                ),
            ],
        )
    ]
    config = create_generate_content_config(seed=0, response_modalities=["text"])
    model_name = "gemini-2.0-flash-exp-image-generation"

    stream_result = client.models.generate_content_stream(
        model=model_name,
        contents=contents,
        config=config,
    )
    response_text, _ = process_output_chunks(stream_result)
    clean_resp = response_text.strip().lower()
    if '"valid": true' in clean_resp or "'valid': true" in clean_resp:
        return True
    return False


# -----------------------------------------------------------------------------
# ENDPOINT #1: /get-outfit-description - returns JSON only
# -----------------------------------------------------------------------------
@app.route("/get-outfit-description", methods=["POST"])
def endpoint_outfit_description():
    """
    Expects JSON: { "image_b64": "..." }
    Decodes that image, runs get_outfit_description, returns JSON w/ full text.
    """
    data = request.get_json()
    if not data or "image_b64" not in data:
        return jsonify({"error": "No 'image_b64' found"}), 400

    img_b64 = data["image_b64"]
    # decode to temp file
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        tmp.write(base64.b64decode(img_b64))
        tmp.flush()
        image_path = tmp.name

    # Create client & get description
    client = create_genai_client(api_key=os.environ.get("GEMINI_API_KEY"))
    description = get_outfit_description(client, [image_path], seed=123)

    # Return JSON with the entire description
    return jsonify({"outfit_description": description})


# -----------------------------------------------------------------------------
# ENDPOINT #2: /generate-shoes - SSE only valid images
# -----------------------------------------------------------------------------
@app.route("/generate-shoes", methods=["POST"])
def endpoint_generate_shoes():
    """
    Expects JSON: { "outfit_description": "<some text>" }
    Streams SSE for each valid shoe image; we skip invalid images.
    We'll generate up to 4 valid images or run out of seeds.
    NO final summary is sent.
    """
    data = request.get_json()
    if not data or "outfit_description" not in data:
        return jsonify({"error": "Missing 'outfit_description'"}), 400

    outfit_description = data["outfit_description"]
    client = create_genai_client(api_key=os.environ.get("GEMINI_API_KEY"))

    def stream_valid_images():
        allowed_seeds = list(range(0, 101))
        blocked_seeds = [10, 13, 50]
        results_found = 0
        num_needed = 4

        while results_found < num_needed:
            try:
                seed = get_valid_seed(allowed_seeds, blocked_seeds)
            except ValueError:
                # no valid seeds remain
                break

            # 1. Generate a shoe image (both text + local image file path)
            shoe_text, images_saved = generate_shoe_image(client, seed, outfit_description)
            if not images_saved:
                blocked_seeds.append(seed)
                continue

            image_path = images_saved[0]

            # 2. Run discriminator
            valid = run_discriminator(client, seed, shoe_text, image_path)
            if not valid:
                blocked_seeds.append(seed)
                continue

            # 3. If valid, upload to Imgur and return SSE with the Imgur URL
            try:
                image_url = upload_to_imgur(image_path)
            except Exception as e:
                # If upload fails for some reason, skip this seed
                blocked_seeds.append(seed)
                continue

            payload = {
                "seed": seed,
                "shoe_text": shoe_text,
                "image_url": image_url
            }

            # SSE event: new_valid_image
            yield sse_format("new_valid_image", payload)
            results_found += 1

    return Response(stream_valid_images(), mimetype='text/event-stream')

# @app.route('/merge-shoe', methods=['POST'])
# def merge_shoe():
#     """
#     Expects JSON containing base64-encoded
#       {
#         "person_image": "<base64 string>",
#         "shoe_image": "<base64 string>"
#       }
#     Returns JSON with base64-encoded 'merged_image'.
#     """
#     data = request.get_json()

#     if not data or "person_image" not in data or "shoe_image" not in data:
#         return jsonify({"error": "Missing person_image or shoe_image in JSON"}), 400

#     person_b64 = data["person_image"]
#     shoe_b64 = data["shoe_image"]

#     # Create temporary file paths
#     with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as p_file:
#         p_file.write(base64.b64decode(person_b64))
#         person_path = p_file.name

#     with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as s_file:
#         s_file.write(base64.b64decode(shoe_b64))
#         shoe_path = s_file.name

#     generator(person_path, shoe_path)


#     output_filename = "merged_output.png"
#     if not os.path.exists(output_filename):

#         return jsonify({"error": "No merged output found"}), 500


#     with open(output_filename, "rb") as merged_file:
#         merged_b64 = base64.b64encode(merged_file.read()).decode("utf-8")

#     return jsonify({"merged_image": merged_b64})

@app.route('/process-imgur-url', methods=['POST'])
def process_imgur_url():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "Missing 'url' in request body"}), 400

    image_url = data['url']

    try:
        result = run_pipeline(image_url)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/hello", methods=["GET"])
def hello_world():
    return "Hello, World!"

# SSE formatting utility
def sse_format(event, data):
    if not isinstance(data, str):
        data = json.dumps(data)
    return f"event: {event}\ndata: {data}\n\n"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)