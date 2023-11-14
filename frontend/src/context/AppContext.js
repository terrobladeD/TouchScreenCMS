import React, { createContext, useState, useEffect } from 'react';
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [selectedService, setSelectedService] = useState(null);
    const [flightsData, setFlightsData] = useState(null);
    const [newsData, setNewsData] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState({
        flights: null,
        news: null,
        weather: null,
    });
    const [generalData, setGeneralData] = useState(null);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/datas/general.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setGeneralData(data);
            })
    }, []);

    // Helper function to check if we need to update the data
    const needsUpdate = (lastUpdate) => {
        if (!lastUpdate) return true;
        const now = new Date();
        const last = new Date(lastUpdate);
        return now.getDate() !== last.getDate();
    };

    // Fetch Flights Data
    useEffect(() => {

        // Fetch Flights Data
        const fetchFlightsData = async () => {
            // helper function to sort flights data
            const updateData = (flightsDataRaw) => {
                const now = new Date();
                if (flightsDataRaw !== null) {
                    const updatedData = flightsDataRaw.filter(flight => {
                        const departureTime = new Date(flight.departure.estimated);
                        const arrivalTime = new Date(flight.arrival.estimated);
                        return departureTime > now && arrivalTime > now && flight.flight.iata !== null;
                    }).sort((a, b) => new Date(a.departure.estimated) - new Date(b.departure.estimated));

                    setFlightsData(updatedData);
                }
            };
            try {
                const response = await fetch('http://127.0.0.1:5000/flights');
                if (!response.ok) throw new Error('Network response was not ok for flights');
                const flightsData = await response.json();
                updateData(flightsData);
                setLastUpdated(prev => ({ ...prev, flights: new Date() }));
                // Add any specific handling for flights data here
            } catch (error) {
                console.error('Fetch error for flights:', error);
                setTimeout(fetchFlightsData, 60000); // Retry after 1 minute
            }
        };

        // Fetch News Data
        const fetchNewsData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/news');
                if (!response.ok) throw new Error('Network response was not ok for news');
                const newsData = await response.json();
                setNewsData(newsData);
                setLastUpdated(prev => ({ ...prev, news: new Date() }));
                // Add any specific handling for news data here
            } catch (error) {
                console.error('Fetch error for news:', error);
                setTimeout(fetchNewsData, 60000); // Retry after 1 minute
            }
        };

        // Fetch Weather Data
        const fetchWeatherData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/weather');
                if (!response.ok) throw new Error('Network response was not ok for weather');
                const weatherData = await response.json();
                setWeatherData(weatherData);
                setLastUpdated(prev => ({ ...prev, weather: new Date() }));
                // Add any specific handling for weather data here
            } catch (error) {
                console.error('Fetch error for weather:', error);
                setTimeout(fetchWeatherData, 60000); // Retry after 1 minute
            }
        };


        if (needsUpdate(lastUpdated.flights)) {
            fetchFlightsData();
        }
        if (needsUpdate(lastUpdated.news)) {
            fetchNewsData();
        }
        if (needsUpdate(lastUpdated.weather)) {
            fetchWeatherData();
        }
    }, [lastUpdated]);

    return (
        <AppContext.Provider value={{ generalData, flightsData, newsData, weatherData, selectedService, setSelectedService }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
