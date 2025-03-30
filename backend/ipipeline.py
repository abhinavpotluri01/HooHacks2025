from gem_ext import *
# from imgur import upload_to_imgur

def run_pipeline(image_path):
    proxies = {
        "http": "http://brd-customer-hl_b2a2bd8a-zone-serp_api1:5keq6sn9s4yn@brd.superproxy.io:33335",
        "https": "http://brd-customer-hl_b2a2bd8a-zone-serp_api1:5keq6sn9s4yn@brd.superproxy.io:33335"
    }

    try:
        image_url = image_path
        offers = fetch_google_lens_data(image_url, proxies)
        #save_json(offers, "output_all_with_images.json")

        offers_no_img = remove_image_base64(offers)
        #save_json(offers_no_img, "output_all.json")

        prompt = build_gemini_prompt(offers_no_img)
        gemini_output = call_gemini_model(prompt)

        print("=== Gemini Output ===\n", gemini_output)

        top_ranks = extract_top_ranks(gemini_output)

        filtered = filter_offers_by_rank(offers, top_ranks)
        #save_json(filtered, "output_all_filtered_with_images.json")

        cleaned = clean_offer_fields(filtered)

        return cleaned

    except Exception as e:
        print(f"Error occurred: {e}")

# if __name__ == "__main__":
#     run_pipeline("test-image/test2.png")