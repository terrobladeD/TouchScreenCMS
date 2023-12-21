from datetime import datetime, timedelta, timezone, time
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from lxml import html
import pytz

app = Flask(__name__)
CORS(app)
cached_flights = {
    'data': [],
    'last_updated': None
}

cached_news = {
    'data': [],
    'last_updated': None
}


@app.route('/news', methods=['GET'])
def fetch_news():
    global cached_news
    current_time = datetime.now()

    # Check if cached data is still valid (less than 1 hour old)
    if cached_news['last_updated'] and (current_time - cached_news['last_updated']) < timedelta(hours=3):
        return jsonify(cached_news['data'])

    url = 'https://www.looppng.com/section/40068'
    contents = []

    edit_part_1 = ['1', '2', '3', '4']
    edit_part_2 = ['1', '2']

    news_name = '/html/body/div[5]/div[1]/div/section/div/section/div/div[1]/div/div[{variable1}]/div[{variable2}]/div/span/div/div[3]/div/div[1]/a'
    img_xpath = '/html/body/div[5]/div[1]/div/section/div/section/div/div[2]/div[1]/div/div/img/@src'
    text_xpath = '/html/body/div[5]/div[1]/div/section/div/section/div/div[2]/div[3]/div/div/p/text()'

    try:
        response = requests.get(url)
        response.raise_for_status()
        doc = html.fromstring(response.content)

        for part1 in edit_part_1:
            for part2 in edit_part_2:
                news_name_temp = news_name.replace('{variable1}', part1).replace('{variable2}', part2)
                element = doc.xpath(news_name_temp)

                if element:
                    name = element[0].text_content().strip()
                    href = "https://www.looppng.com" + element[0].get("href").strip()

                    # 请求每条新闻的链接
                    news_response = requests.get(href)
                    news_response.raise_for_status()
                    news_doc = html.fromstring(news_response.content)

                    # 获取图片和文本
                    img = news_doc.xpath(img_xpath)
                    text = news_doc.xpath(text_xpath)

                    # 提取正文内容
                    content_elements = news_doc.xpath('//div[@class="field-item even"]/p/text()')
                    content = '\n\n'.join([element.strip() for element in content_elements])

                    contents.append({
                        "header": name,
                        "img": img[0] if img else "No image found",
                        "text": ''.join(text).strip() if text else "No text found",
                        "content": content  # 添加正文内容
                    })
                    # Update cached flights and the last updated time
                    cached_news['data'] = contents
                    cached_news['last_updated'] = datetime.now()
                else:
                    contents.append(f'Element not found for XPath: {news_name_temp}')

        return jsonify(contents)

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route('/flights', methods=['GET'])
def get_flights():
    global cached_flights
    current_time = datetime.now()
    # Check if cached data is still valid (less than 1 hour old)
    if cached_flights['last_updated'] and (current_time - cached_flights['last_updated']) < timedelta(hours=3):
        return jsonify(cached_flights['data'])

    all_flights = get_flights_outside_png()
    if len(all_flights) < 1:
        all_flights = get_flights_outside_png2

    cached_flights['data'] = all_flights
    cached_flights['last_updated'] = datetime.now()
    return jsonify(all_flights)


def get_flights_outside_png():
    base_url = "http://api.aviationstack.com/v1/flights"
    access_key = "05778da3c983d154c4961b3f67768ab4"  # Replace with your actual access key
    limit = 100
    offset = 0
    all_flights = []

    while True:
        params = {
            'access_key': access_key,
            'limit': limit,
            'offset': offset,
            'dep_iata': 'POM'  # Departure IATA code for Port Moresby
        }
        try:
            response = requests.get(base_url, params=params, timeout=5)
            response.raise_for_status()  # Raise an exception for HTTP errors
            data = response.json()

            for flight in data['data']:
                if flight['arrival']['timezone'] != 'Pacific/Port_Moresby':
                    simplified_flight = {
                        'flight': {
                            'iata': flight['flight']['iata'],
                            'icao': flight['flight']['icao']
                        },
                        'departure': {
                            'estimated': flight['departure']['estimated'],
                            'timezone': flight['departure']['timezone'],
                            'terminal': flight['departure']['terminal'],
                            'iata': flight['departure']['iata']
                        },
                        'arrival': {
                            'estimated': flight['arrival']['estimated'],
                            'timezone': flight['arrival']['timezone'],
                            'terminal': flight['arrival']['terminal'],
                            'iata': flight['arrival']['iata']
                        }
                    }
                    all_flights.append(simplified_flight)

            if len(data['data']) < limit:
                break
            else:
                offset += limit  # Prepare offset for the next iteration
        except requests.RequestException as e:
            return []

    return all_flights


def get_flights_outside_png2():
    local_tz = pytz.timezone("Pacific/Port_Moresby")
    today = datetime.now(timezone.utc).date()
    local_now = datetime.now(local_tz)
    local_midnight = datetime.combine(local_now.date(), time(0, 0))
    # Convert the local midnight time to UTC and get the timestamp
    utc_midnight = local_midnight.astimezone(pytz.utc)
    timestamp = int(utc_midnight.timestamp())
    # today = datetime.now().date()
    # midnight = datetime.combine(today, datetime.min.time())
    # timestamp = int(midnight.replace(tzinfo=timezone.utc).timestamp())

    api_url = "https://api.flightradar24.com/common/v1/airport.json?code=pom&plugin-setting[schedule][mode]=departures&plugin-setting[schedule][timestamp]=" + str(
        timestamp) + "&page=1&limit=100"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    }
    response = requests.get(api_url, headers=headers)
    response.raise_for_status()  # Raise an exception for HTTP errors
    data = response.json()
    flights = data["result"]["response"]["airport"]["pluginData"]["schedule"]["departures"]["data"]
    all_flights = []
    today_port_moresby = datetime.now(pytz.timezone("Pacific/Port_Moresby"))
    # print(flights)
    for flight in flights:
        departure_time = datetime.fromtimestamp(flight["flight"]["time"]["scheduled"]["departure"], timezone.utc)
        arrival_time = datetime.fromtimestamp(flight["flight"]["time"]["scheduled"]["arrival"], timezone.utc)
        if (flight["flight"]["airport"]["destination"]["timezone"][
            "name"] != "Pacific/Port_Moresby" and departure_time.date() == today_port_moresby.date()):
            simplified_flight = {
                'flight': {
                    'iata': flight["flight"]["identification"]["number"]["default"],
                    'icao': flight["flight"]["identification"]["number"]["alternative"] if
                    flight["flight"]["identification"]["number"]["alternative"] else ""
                },
                'departure': {
                    'estimated': departure_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    'timezone': flight["flight"]["airport"]["origin"]["timezone"]["name"],
                    'iata': 'POM'
                },
                'arrival': {
                    'estimated': arrival_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    'timezone': flight["flight"]["airport"]["destination"]["timezone"]["name"],
                    'iata': flight["flight"]["airport"]["destination"]["code"]["iata"]
                }
            }
            all_flights.append(simplified_flight)

    return all_flights


@app.route('/weather', methods=['GET'])
def get_weather():
    api_url = "http://api.weatherapi.com/v1/forecast.json"
    api_key = "6362a44c4b9b4f3eaa901303231011"  # Replace with your actual API key
    location = "iata:POM"
    days = 3

    params = {
        'key': api_key,
        'q': location,
        'days': days,
        'aqi': 'no',
        'alerts': 'no'
    }

    response = requests.get(api_url, params=params)
    response.raise_for_status()  # Raise an exception for HTTP errors
    data = response.json()

    simplified_forecast = []
    for day in data['forecast']['forecastday']:
        day_data = {
            'date': day['date'],
            'maxtemp_c': day['day']['maxtemp_c'],
            'mintemp_c': day['day']['mintemp_c'],
            'condition': day['day']['condition']
        }
        simplified_forecast.append(day_data)

    return jsonify(simplified_forecast)


@app.route('/', methods=['GET'])
def demo():
    return "this is a flask server"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3003, debug=True)
    # app.run(host='13.211.227.153', port=3003, debug=True)
