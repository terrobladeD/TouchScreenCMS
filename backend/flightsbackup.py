import requests
from lxml import html
from datetime import datetime, timezone

api_url = "https://api.flightradar24.com/common/v1/airport.json?code=pom&plugin-setting[schedule][mode]=departures&plugin-setting[schedule][timestamp]=1702213200&page=1&limit=100"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
}
today = datetime.now(timezone.utc).date()
response = requests.get(api_url,headers=headers)
response.raise_for_status()  # Raise an exception for HTTP errors
data = response.json()
flights = data["result"]["response"]["airport"]["pluginData"]["schedule"]["departures"]["data"]
for flight in flights:
    departure_time = datetime.fromtimestamp(flight["flight"]["time"]["scheduled"]["departure"], timezone.utc)
    arrival_time = datetime.fromtimestamp(flight["flight"]["time"]["scheduled"]["arrival"], timezone.utc)
    if (flight["flight"]["airport"]["destination"]["timezone"]["name"] != "Pacific/Port_Moresby" and departure_time.date() == today):
        # print(flight["flight"]["identification"]["number"]["default"], end="||") # PX200
        print(flight["flight"]["airline"]["code"]["iata"], end="||") # flight/iata
        print(flight["flight"]["airline"]["code"]["icao"], end="||") # flight/icao
        # print(flight["flight"]["airport"]["origin"]["timezone"]["name"], end="||") # departure timezone
        # print(flight["flight"]["airport"]["destination"]["timezone"]["name"], end="||") # arrival timezone
        print("POM", end="||") # departure/iata
        print(flight["flight"]["airport"]["destination"]["code"]["iata"], end="||")  # arrival/iata
        print(departure_time.strftime("%H:%M:%ST%d-%m-%Y"), end="||")  # departure/estimated
        print(arrival_time.strftime("%H:%M:%ST%d-%m-%Y"), end="||")  # arrival/estimated
        print()
