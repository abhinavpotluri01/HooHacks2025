from google import genai
from google.genai import types
import mimetypes
import random
import base64
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

def save_binary_file(file_name: str, data: bytes) -> None:
    """Save binary data to a local file."""
    with open(file_name, "wb") as f:
        f.write(data)

def generate_image_with_shoe(
    person_image_path: str,
    shoe_image_path: str,
    prompt_text: str,
    api_key: str = API_KEY
):

    # Create client
    client = genai.Client(api_key=api_key)

    # Upload both person and shoe images
    person_image = client.files.upload(file=person_image_path)
    shoe_image = client.files.upload(file=shoe_image_path)

    # Prepare prompt
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_uri(
                    file_uri=person_image.uri,
                    mime_type=person_image.mime_type,
                ),
                types.Part.from_uri(
                    file_uri=shoe_image.uri,
                    mime_type=shoe_image.mime_type,
                ),
                types.Part.from_text(text=prompt_text),
            ]
        )
    ]

    # Config
    config = types.GenerateContentConfig(
        seed=random.randint(0, 100),
        temperature=0.9,
        top_p=0.95,
        response_modalities=["image", "text"],
        safety_settings=[
            types.SafetySetting(
                category="HARM_CATEGORY_CIVIC_INTEGRITY",
                threshold="OFF",
            )
        ],
        response_mime_type="text/plain"
    )

    # Stream response
    for chunk in client.models.generate_content_stream(
        model="gemini-2.0-flash-exp-image-generation",
        contents=contents,
        config=config,
    ):
        # Skip if the chunk is empty or malformed
        if not chunk.candidates or not chunk.candidates[0].content or not chunk.candidates[0].content.parts:
            continue

        part = chunk.candidates[0].content.parts[0]

        # If we have inline data (image), save it
        if part.inline_data:
            file_extension = mimetypes.guess_extension(part.inline_data.mime_type) or ".png"
            file_name = f"merged_output{file_extension}"
            save_binary_file(file_name, part.inline_data.data)
            print(f"✅ Image saved as: {file_name}")
        else:
            # Otherwise, print text
            print("Text Response:", chunk.text)

def generator(person_image,shoe_image):
    # Paths to your source images
    person_path = person_image
    shoe_path = shoe_image

    # Your prompt text
    prompt_text = """
Your main aim is to make this person wear the shoe and it should look natural.
My area of interest is below their knees. Generate a high quality image without killing the vibe of it.
Don't change any aspect of the shoe and keep the background exactly same.
Remember, highly focus on area below knees. ***Only generate image below the knees***
    """

    # Call the generation function
    generate_image_with_shoe(
        person_image_path=person_path,
        shoe_image_path=shoe_path,
        prompt_text=prompt_text,
        api_key=API_KEY
    )

# if __name__ == "__main__":
#     generator("test-image/cut.jpg","test-image/test1.png")
