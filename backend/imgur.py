import requests
import urllib3
import os
from dotenv import load_dotenv

load_dotenv()
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


# Load all Imgur client IDs from .env
IMGUR_CLIENT_IDS = [
    os.getenv("IMGUR_CLIENT_ID_1"),
    os.getenv("IMGUR_CLIENT_ID_2"),
    os.getenv("IMGUR_CLIENT_ID_3"),
]

# Remove any missing or empty ones
IMGUR_CLIENT_IDS = [cid for cid in IMGUR_CLIENT_IDS if cid]


# Simple manager to rotate Imgur client IDs
class ImgurClientManager:
    def __init__(self, client_ids):
        self.client_ids = client_ids
        self.index = 0

    def get(self):
        if not self.client_ids:
            raise RuntimeError("No Imgur Client IDs available.")
        return self.client_ids[self.index]

    def rotate(self):
        self.index = (self.index + 1) % len(self.client_ids)


imgur_manager = ImgurClientManager(IMGUR_CLIENT_IDS)


def upload_to_imgur(image_path):
    max_retries = len(IMGUR_CLIENT_IDS)

    for _ in range(max_retries):
        client_id = imgur_manager.get()
        headers = {"Authorization": f"Client-ID {client_id}"}

        with open(image_path, "rb") as image_file:
            files = {"image": image_file}
            response = requests.post("https://api.imgur.com/3/image", headers=headers, files=files)

        if response.status_code == 200:
            image_url = response.json()["data"]["link"]
            print(f"✅ Image uploaded with {client_id[:6]}...: {image_url}")
            return image_url
        else:
            print(f"❌ Imgur upload failed with {client_id[:6]}...: {response.status_code}, rotating...")
            imgur_manager.rotate()

    raise RuntimeError("All Imgur Client IDs failed.")
