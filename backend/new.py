import os
import json
import random
import time
import base64
from flask import Flask, request, jsonify, Response

app = Flask(__name__)

def sse_format(event, data):
    """Utility to format messages for Server-Sent Events."""
    if not isinstance(data, str):
        data = json.dumps(data)
    return f"event: {event}\ndata: {data}\n\n"

@app.route("/get-outfit-description", methods=["POST"])
def endpoint_outfit_description():
    """Endpoint that expects a base64 image in 'image_b64'."""
    data = request.get_json()
    if not data or "image_b64" not in data:
        return jsonify({"error": "No 'image_b64' found"}), 400

    try:
        # Decode and save the base64 image as a PNG
        image_b64 = data["image_b64"]
        image_bytes = base64.b64decode(image_b64)
        with open("uploaded_image.png", "wb") as f:
            f.write(image_bytes)
    except Exception as e:
        return jsonify({"error": f"Failed to decode image: {str(e)}"}), 400

    return jsonify({
        "outfit_description": "He is wearing navy pants and a casual streetwear vibe."
    })

@app.route("/generate-shoes", methods=["POST"])
def endpoint_generate_shoes():
    """
    Returns SSE events with a public image URL (no base64).
    Sends 4 events, one every 20 seconds, to simulate 'generation time'.
    """
    data = request.get_json()
    if not data or "outfit_description" not in data:
        return jsonify({"error": "Missing 'outfit_description'"}), 400

    def stream_valid_images():
        for _ in range(4):
            time.sleep(3)  # Simulate time to generate an image

            seed = random.randint(0, 100)
            shoe_text = f"Mock shoe description for seed {seed}"
            # Just return a mock link instead of base64
            image_url = "https://i.imgur.com/o7aHelA.png"
            
            payload = {
                "seed": seed,
                "shoe_text": shoe_text,
                "image_url": image_url
            }
            yield sse_format("new_valid_image", payload)

    return Response(stream_valid_images(), mimetype='text/event-stream')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)