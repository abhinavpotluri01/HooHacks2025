import requests
import urllib3
import os
from dotenv import load_dotenv

load_dotenv()

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IMGUR_CLIENT_ID = os.getenv("IMGUR_CLIENT_ID")

# Step 1: Upload image to Imgur
def upload_to_imgur(image_path):
    headers = {
        "Authorization": f"Client-ID {IMGUR_CLIENT_ID}"
    }
    with open(image_path, "rb") as image_file:
        files = {"image": image_file}
        response = requests.post("https://api.imgur.com/3/image", headers=headers, files=files)
    
    if response.status_code == 200:
        image_url = response.json()['data']['link']
        print("✅ Image uploaded:", image_url)
        return image_url
    else:
        raise RuntimeError(f"Imgur upload failed: {response.status_code}, {response.text}")
