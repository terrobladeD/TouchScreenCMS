'''
requirements:
# 0. this is a routine script, runs every 24 hours
# 1. know which hotel that needs to download
# 2. download all data files (general.json & advertisement.json & hotel.json)
# 3. download all assets. If filename do not change then no need to download
'''

import os
import time
import random
import requests
import json
from urllib.parse import urlparse
from datetime import datetime, timedelta

# Golbal Settings for File Location
has_full_download_performed = False  # whether it needs to download all
hotel_id = ""


# Function to load and return the content of a JSON file
def load_json_file(file_path):
    with open(file_path, 'r', encoding='UTF-8') as file:
        return json.load(file)


# Placeholder for hotel information
def get_hotel_to_download():
    hotels = [
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
    print("Please choose a hotel to download the content for:")
    for i, hotel in enumerate(hotels):
        print(f"{i + 1}. {hotel}")
    choice = input("Enter the number of the hotel: ")

    # 确保用户输入是有效的
    while not choice.isdigit() or not 0 < int(choice) <= len(hotels):
        print("Invalid selection. Please enter a number from the list.")
        choice = input("Enter the number of the hotel: ")

    # 返回用户选择的酒店
    return hotels[int(choice) - 1]


# Download a file from a given URL
def download_file(url, local_filename):
    global has_full_download_performed
    if has_full_download_performed and os.path.exists(local_filename):
        print(f"{local_filename} already exists, skipping download.")
        return

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
def download_image(url, directory, filename):
    global has_full_download_performed

    if filename.startswith('http') or filename.startswith('https'):
        filename = os.path.basename(urlparse(filename).path)

    full_path = os.path.join(directory, filename)
    if not os.path.exists(full_path) or not has_full_download_performed:
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
def download_images_from_json(json_data, base_url, directory):
    if isinstance(json_data, dict):
        for key, value in json_data.items():
            if '_url' in key:
                if isinstance(value, str):
                    # Single URL
                    download_image(base_url + value, directory, value)
                elif isinstance(value, list):
                    # List of URLs
                    for url in value:
                        if isinstance(url, str):
                            download_image(base_url + url, directory, url)
            elif isinstance(value, (dict, list)):
                download_images_from_json(value, base_url, directory)
    elif isinstance(json_data, list):
        for item in json_data:
            download_images_from_json(item, base_url, directory)


# Function to extract and download images from a JSON structure
def download_videos_from_json(json_data, base_url, directory):
    if isinstance(json_data, dict):
        for key, value in json_data.items():
            if key == "hotel_videos" and isinstance(value, list):
                for image_url in value:
                    download_image(base_url + image_url, directory, image_url)
    elif isinstance(json_data, list):
        for item in json_data:
            download_videos_from_json(item, base_url, directory)


# Main routine that runs every 24 hours
def main_routine():
    global has_full_download_performed
    global hotel_id

    if not has_full_download_performed:
        hotel_id = get_hotel_to_download()

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
    download_images_from_json(advertisement_json, advertisement_base_url, "images/advertisement")
    download_images_from_json(general_json, general_base_url, "images/general")
    download_images_from_json(hotel_json, "", "images/general")
    download_videos_from_json(hotel_json, hotel_videos_url, "videos")

    has_full_download_performed = True


# 计算距离下一个4:00 AM的时间（加上或减去最多1小时的随机时间）
def calculate_wait_time():
    now = datetime.now()
    # 设置下一个4:00 AM的时间点
    next_4_am = now.replace(hour=4, minute=0, second=0, microsecond=0) + timedelta(days=1)
    # 添加或减去最多1小时的随机时间
    random_offset = timedelta(seconds=random.randint(-3600, 3600))  # -1小时到+1小时
    waittime = (next_4_am + random_offset - now).total_seconds()
    return max(0, int(waittime))  # 确保等待时间不为负数


if __name__ == "__main__":
    while True:
        main_routine()
        wait_time = calculate_wait_time()
        print(f"下次更新将在大约{wait_time / 60 / 60:.2f}小时后执行。")
        # break  # 如果要一直运行就把这个注释掉
        time.sleep(wait_time)
