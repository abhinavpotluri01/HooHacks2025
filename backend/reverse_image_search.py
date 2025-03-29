import requests
import json
from PIL import Image
import os

# Define input and output paths
##input_path = os.path.expanduser("~/Downloads/Concept Shoe.webp")
##output_path = os.path.expanduser("~/Downloads/Concept_Shoe.jpg")  # Use underscore to avoid space issues

# Convert .webp to .jpg
##im = Image.open(input_path).convert("RGB")
##im.save(output_path, "JPEG")

##print(f"Saved JPG to: {output_path}")

# Set your variables
SERPAPI_KEY = '0681ae6f9e4eb0a4e25eba782d6fb9fc001365c784da6320481aeb5e74bd1c01'
##IMAGE_URL = 'https://i.imgur.com/lhZ6YI9.jpeg'  # replace with your hosted image URL
IMAGE_URL = "https://i.imgur.com/o4S1WLG.jpeg"

# Set SerpAPI parameters
params = {
    "engine": "google_reverse_image",
    "image_url": IMAGE_URL,
    "api_key": SERPAPI_KEY
}

# Make the request
response = requests.get("https://serpapi.com/search", params=params)

# Parse the results
data = response.json()

with open("serpapi_output.json", "w") as f:
    json.dump(data, f, indent=2)

print("Saved output to serpapi_output.json")

if "error" in data:
    print("\n🚨 SerpAPI Error:")
    print(data["error"])

# Example output handler
##image_results = data.get("image_results", [])

##for i, result in enumerate(image_results[:4]):
##    print(f"Result #{i+1}")
##    print("Title:", result.get("title"))
##    print("Link:", result.get("link"))        # direct product page
##    print("Thumbnail:", result.get("thumbnail"))  # small image preview
##    print("Source:", result.get("source"))
##    print()

print("Top-level keys:", list(data.keys()))

# Try shopping results first
if "shopping_results" in data and data["shopping_results"]:
    print("\n🛍️ Shopping Results:")
    for i, item in enumerate(data["shopping_results"][:4]):
        print(f"\nResult #{i+1}")
        print("Title:", item.get("title"))
        print("Price:", item.get("price"))
        print("Link:", item.get("link"))
        print("Thumbnail:", item.get("thumbnail"))

# Fallback: image results
elif "image_results" in data and data["image_results"]:
    print("\n📸 Image Results:")
    for i, result in enumerate(data["image_results"][:4]):
        print(f"\nResult #{i+1}")
        print("Title:", result.get("title"))
        print("Link:", result.get("link"))
        print("Thumbnail:", result.get("thumbnail"))
        print("Source:", result.get("source"))
else:
    print("\n❌ No useful results found.")

##if "visual_matches" in data:
##    print("🎯 Visual Matches:")
##    for i, item in enumerate(data["visual_matches"][:4]):
##        print(f"\nResult #{i+1}")
##        print("Title:", item.get("title"))
##        print("Link:", item.get("link"))
##        print("Thumbnail:", item.get("thumbnail"))
##        print("Source:", item.get("source"))
