import requests
import json
import urllib3
import re
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IMGUR_CLIENT_ID = os.getenv("IMGUR_CLIENT_ID")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY_II")
GEMINI_MODEL_NAME = "gemini-2.5-pro-exp-03-25"


def fetch_google_lens_data(image_url, proxies):
    try:
        response = requests.get(
            "https://lens.google.com/uploadbyurl",
            params={"url": image_url, "brd_json": "1"},
            proxies=proxies,
            verify=False,
            timeout=30
        )
        response.raise_for_status()
        return response.json().get("offers", [])
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Failed to fetch data from Google Lens: {e}")

# Utility to remove base64 image data
def remove_image_base64(offers):
    return [{k: v for k, v in offer.items() if k != "image_base64"} for offer in offers]

# Gemini Prompt Builder
def build_gemini_prompt(offers):
    return f"""
Here is JSON containing multiple offers. Each offer has a "global_rank" field.
1. Filter only those whose price starts with "$" (USD). 
2. Among those, please consider only items that are real products (not search pages, etc.)
3. From that filtered subset, return ONLY a short textual list of the top 6 global ranks, 
   sorted from lowest rank to highest rank, in this format:

And here are the top 6 global ranks from the filtered list above (sorted lowest first):
1.  XX
2.  XX
3.  XX
4.  XX
5.  XX
6.  XX

JSON to analyze:
{json.dumps({"images": offers}, indent=4)}
"""

# Gemini API Call
def call_gemini_model(prompt):
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        contents = [types.Content(role="user", parts=[types.Part.from_text(text=prompt)])]
        config = types.GenerateContentConfig(response_mime_type="text/plain")
        output = []
        for chunk in client.models.generate_content_stream(
            model=GEMINI_MODEL_NAME, contents=contents, config=config
        ):
            output.append(chunk.text)
        return "".join(output)
    except Exception as e:
        raise RuntimeError(f"Gemini API call failed: {e}")

# Extract ranks from Gemini output
def extract_top_ranks(text_output):
    pattern = re.compile(r'^\d+\.\s+(\d+)', re.MULTILINE)
    return [int(rank) for rank in pattern.findall(text_output)]

# Filter original offers by top ranks
def filter_offers_by_rank(offers, top_ranks):
    return [
        offer for offer in offers
        if "global_rank" in offer and offer["global_rank"] in top_ranks
    ]


def clean_offer_fields(offers):
    return [
        {k: v for k, v in offer.items() if k not in {"logo", "image_base64"}}
        for offer in offers
    ]

def add_shoe_name_field_with_gemini(offers):
    titles = [offer.get("title", "") for offer in offers if "title" in offer]

    prompt = f"""
You are given a list of product titles from e-commerce offers. Your task is to extract the **core shoe name** from each title.

Remove unnecessary parts like:
- Seller (e.g., "Amazon.com")
- Descriptors like size, color, material, comfort
- Tags like "Water Resistant", "Spikeless", "All-Day Comfort"

Keep only the **main shoe name**, such as:
"Nike Air Max 90", etc.

Return your answer in JSON format as a list of objects:
[
  {{ "original_title": "...", "shoe_name": "..." }},
  ...
]

Titles:
{json.dumps(titles, indent=2)}
"""

    response_text = call_gemini_model(prompt)
    
    try:
        # Try to extract structured JSON
        parsed = json.loads(response_text)
        shoe_name_map = {
            item["original_title"]: item["shoe_name"]
            for item in parsed if "original_title" in item and "shoe_name" in item
        }
        for offer in offers:
            title = offer.get("title")
            if title in shoe_name_map:
                offer["shoe_name"] = shoe_name_map[title]
    except Exception as e:
        raise RuntimeError(f"Failed to parse Gemini shoe name JSON: {e}")

    return offers


# # Save to JSON
# def save_json(data, filename):
#     with open(filename, "w") as f:
#         json.dump(data, f, indent=4)



# if __name__ == "__main__":
#     run_pipeline("test-image/test2.png")
