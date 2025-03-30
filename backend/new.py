from flask import Flask, Response, stream_with_context
import time
from flask_cors import CORS
import base64
from flask import jsonify

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins
# SSE endpoint

@app.route('/sse')
def sse():
    def generate():
        print('works in backend')
        # Simulate sending multiple images as Base64-encoded strings
        image_paths = ['image1.png', 'image2.png']
        for image_path in image_paths:
            with open(image_path, 'rb') as image_file:
                # Read the image as binary and encode it as Base64
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                yield f"data:image/png;base64,{encoded_image}\n\n"  # Send the Base64 string as SSE data
                time.sleep(5)  # Simulate a delay between messages

    return Response(stream_with_context(generate()), content_type='text/event-stream')


@app.route('/get')
def get():
    print('works in backend')  # Log to confirm the endpoint is hit
    return jsonify({"message": "Backend is working!"})  # Return a proper JSON response

@app.route('/test')
def test():
    print('works in backend')  # Log to confirm the endpoint is hit

    # Path to the image file
    image_path = 'image1.png'  # Replace with the path to your image

    try:
        # Read the image as binary and encode it as Base64
        with open(image_path, 'rb') as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

        # Return the Base64 string as a JSON response
        return jsonify({
            "message": "Image fetched successfully!",
            "image": f"data:image/png;base64,{encoded_image}"  # Include the MIME type
        })

    except FileNotFoundError:
        return jsonify({
            "message": "Image not found!",
            "image": None
        }), 404



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)



