import requests

def test_process_imgur_url():
    url = "http://52.14.110.45:5000/process-imgur-url"
    imgur_url = "https://imgur.com/a/3vXsnai"

    response = requests.post(url, json={"url": imgur_url})

    if response.status_code == 200:
        print(response.json())
    else:
        print("Error:", response.status_code, response.text)

if __name__ == "__main__":
    test_process_imgur_url()