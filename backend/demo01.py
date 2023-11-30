from datetime import datetime, timedelta
from flask import Flask, jsonify
from flask_cors import CORS
import requests
from lxml import html

app = Flask(__name__)
CORS(app)
cached_flights = {
    'data': [],
    'last_updated': None
}

CORS(app, origins=["http://localhost:3000"])


@app.route('/news', methods=['GET'])
def fetch_news():
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

                    contents.append({
                        "header": name,
                        "href": href,
                        "img": img[0] if img else "No image found",
                        "text": ''.join(text).strip() if text else "No text found"
                    })
                else:
                    contents.append(f'Element not found for XPath: {news_name_temp}')

        return jsonify(contents)

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/flights', methods=['GET'])
def get_flights_outside_png():
    global cached_flights
    current_time = datetime.now()

    # Check if cached data is still valid (less than 1 hour old)
    if cached_flights['last_updated'] and (current_time - cached_flights['last_updated']) < timedelta(hours=3):
        return jsonify(cached_flights['data'])

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

        response = requests.get(base_url, params=params)
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

    # Update cached flights and the last updated time
    cached_flights['data'] = all_flights
    cached_flights['last_updated'] = datetime.now()

    return jsonify(all_flights)

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
    app.run(debug=True)
