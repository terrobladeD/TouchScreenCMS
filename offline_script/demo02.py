import threading
import time
import os
import random
import requests
import json
from urllib.parse import urlparse
from datetime import datetime, timedelta

# Global Variable
hotel_id = ""
HOTEL_LIST = [
    "crown_hotel",
    "elabeach_hotel",
    "gateway_hotel",
    "grandpapua_hotel",
    "hilton_hotel",
    "holidayexpress_hotel",
    "holidayinn_hotel",
    "loloata_hotel",
    "stanely_hotel"
]

if os.path.exists('datas/hotel.json'):
    try:
        with open('datas/hotel.json', 'r') as file:
            data = json.load(file)
        hotel_id = data[0].get('hotel_id') if data else None
    except (json.JSONDecodeError, IndexError, KeyError):
        pass


# Function to load and return the content of a JSON file
def load_json_file(file_path):
    with open(file_path, 'r', encoding='UTF-8') as file:
        return json.load(file)


# Download a file from a given URL
def download_file(url, local_filename):
    response = requests.get(url, stream=True)
    print(url)
    if response.status_code == 200:
        with open(local_filename, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        print(f"Downloaded {local_filename}")
    else:
        print(f"Failed to download {local_filename}")


# Function to create directories if they don't exist
def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)


# Function to download an image
def download_image(url, directory, filename, ignore_duplicates=True):
    if filename.startswith('http') or filename.startswith('https'):
        filename = os.path.basename(urlparse(filename).path)

    full_path = os.path.join(directory, filename)
    if not os.path.exists(full_path) or not ignore_duplicates:
        response = requests.get(url)
        if response.status_code == 200:
            with open(full_path, 'wb') as file:
                file.write(response.content)
            print(f"Downloaded {full_path}")
        else:
            print(f"Failed to download {full_path}")
    else:
        print(f"{full_path} already exists. Skipping download.")


# Function to extract and download images from a JSON structure
def download_images_from_json(json_data, base_url, directory, ignore_duplicates):
    if isinstance(json_data, dict):
        for key, value in json_data.items():
            if '_url' in key:
                if isinstance(value, str):
                    # Single URL
                    download_image(base_url + value, directory, value, ignore_duplicates)
                elif isinstance(value, list):
                    # List of URLs
                    for url in value:
                        if isinstance(url, str):
                            download_image(base_url + url, directory, url, ignore_duplicates)
            elif isinstance(value, (dict, list)):
                download_images_from_json(value, base_url, directory,ignore_duplicates)
    elif isinstance(json_data, list):
        for item in json_data:
            download_images_from_json(item, base_url, directory,ignore_duplicates)


# Function to extract and download images from a JSON structure
def download_videos_from_json(json_data, base_url, directory, ignore_duplicates=True):
    if isinstance(json_data, dict):
        for key, value in json_data.items():
            if key == "hotel_videos" and isinstance(value, list):
                for image_url in value:
                    download_image(base_url + image_url, directory, image_url, ignore_duplicates)
    elif isinstance(json_data, list):
        for item in json_data:
            download_videos_from_json(item, base_url, directory, ignore_duplicates)


# Calculate waiting time
def calculate_wait_time():
    now = datetime.now()
    next_4_am = now.replace(hour=4, minute=0, second=0, microsecond=0) + timedelta(days=1)
    random_offset = timedelta(seconds=random.randint(-3600, 3600))  # -1 to +1 random
    waittime = (next_4_am + random_offset - now).total_seconds()
    return max(0, int(waittime))  # 确保等待时间不为负数


# Function for Changing Displayed Hotel
def hotel_change():
    global hotel_id

    def get_input(input_list):
        input_list.append(input("Enter the number to change the hotel in 5 seconds: "))

    for i, hotel in enumerate(HOTEL_LIST):
        print(f"{i + 1}. {hotel}")

    input_list = []
    input_thread = threading.Thread(target=get_input, args=(input_list,))
    input_thread.start()

    # 5 seconds countdown
    countdown = 5
    while countdown > 0:
        time.sleep(1)
        countdown -= 1
        if input_list:
            print("You entered:", input_list[0])
            if input_list[0].isdigit() and 0 < int(input_list[0]) <= len(HOTEL_LIST):
                hotel_id = HOTEL_LIST[int(input_list[0]) - 1]
                main_routine(HOTEL_LIST[int(input_list[0]) - 1],
                             ignore_duplicates=False)  # place to come to main routine
            else:
                print("Invalid selection.")
            return

    print("continue with the current hotel")
    main_routine(hotel_id, ignore_duplicates=True)
    return


# Function for First Time Hotel
def hotel_first():
    global hotel_id
    for i, hotel in enumerate(HOTEL_LIST):
        print(f"{i + 1}. {hotel}")
    hotel_index = input("Enter the number to of the hotel ")
    while not hotel_index.isdigit() or not 0 < int(hotel_index) <= len(HOTEL_LIST):
        print("Invalid selection. input again")
        hotel_index = input("Enter the number to of the hotel ")
    else:
        hotel_id = HOTEL_LIST[int(hotel_index) - 1]
        main_routine(HOTEL_LIST[int(hotel_index) - 1], ignore_duplicates=False)  # place to come to main routine
    return


# Main routine that runs every 24 hours
def main_routine(hotel_id, ignore_duplicates):
    # Define URLs for data files
    general_json_url = f"http://13.211.227.153/api/GetAllItemsWithHotelID/{hotel_id}"
    advertisement_json_url = f"http://13.211.227.153/api/GetAdvertisementByHotelId/{hotel_id}"
    hotel_json_url = f"http://13.211.227.153/api/GetHotelItemByID/{hotel_id}"

    create_directory("datas")
    # Download data files
    download_file(general_json_url, "datas/general.json")
    download_file(advertisement_json_url, "datas/advertisement.json")
    download_file(hotel_json_url, "datas/hotel.json")

    # Load JSON data
    advertisement_json = load_json_file("datas/advertisement.json")
    general_json = load_json_file("datas/general.json")
    hotel_json = load_json_file("datas/hotel.json")

    # Define base URLs for the images
    advertisement_base_url = "https://touchscreen-cms.s3.ap-southeast-2.amazonaws.com/advertisement/"
    general_base_url = "https://touchscreen-cms.s3.ap-southeast-2.amazonaws.com/general/"
    hotel_videos_url = "https://touchscreen-cms.s3.ap-southeast-2.amazonaws.com/videos/"

    # Create directories for downloaded images
    create_directory("images/advertisement")
    create_directory("images/general")
    create_directory("videos")

    # Download images
    download_images_from_json(advertisement_json, advertisement_base_url, "images/advertisement", ignore_duplicates)
    download_images_from_json(hotel_json, "", "images/general", ignore_duplicates)
    download_videos_from_json(hotel_json, hotel_videos_url, "videos", ignore_duplicates)
    download_images_from_json(general_json, general_base_url, "images/general", True)


if __name__ == "__main__":
    while True:
        if os.path.exists("datas"):
            # 1. check if it is the first time
            hotel_change()
        else:
            # 2. go new hotel logic or existing hotel logic
            hotel_first()
        wait_time = calculate_wait_time()
        print(f"next update will come in {wait_time / 60 / 60:.2f}hours")
        first_run = False
        # break  # 如果要一直运行就把这个注释掉`
        time.sleep(wait_time)
