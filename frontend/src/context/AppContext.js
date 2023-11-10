import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [hasHeader, setHasHeader] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [flightsData, setFlightsData] = useState(null);
    const [newsData, setNewsData] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState({
        flights: null,
        news: null,
        weather: null,
    });

    // Helper function to check if we need to update the data
    const needsUpdate = (lastUpdate) => {
        if (!lastUpdate) return true;
        const now = new Date();
        const last = new Date(lastUpdate);
        return now.getDate() !== last.getDate();
    };

    useEffect(() => {
        const updateData = () => {
            const now = new Date();
            if (flightsData !== null){
                const updatedData = flightsData.filter(flight => {
                    const departureTime = new Date(flight.departure.estimated);
                    const arrivalTime = new Date(flight.arrival.estimated);
                    return departureTime > now && arrivalTime > now && flight.flight.iata !== null;
                }).sort((a, b) => new Date(a.departure.estimated) - new Date(b.departure.estimated));
    
                setFlightsData(updatedData);
            }
        };
        updateData();
        const interval = setInterval(updateData, 300000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        // Helper function to fetch data
        const fetchData = async (url, setter, type) => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setter(data);
                setLastUpdated(prev => ({ ...prev, [type]: new Date() }));
            } catch (error) {
                console.error('Fetch error:', error);
                setTimeout(() => fetchData(url, setter, type), 60000); // Retry after 1 minute
            }
        };

        if (needsUpdate(lastUpdated.flights)) {
            fetchData('http://127.0.0.1:5000/flights', setFlightsData, 'flights');
        }
        if (needsUpdate(lastUpdated.news)) {
            fetchData('http://127.0.0.1:5000/news', setNewsData, 'news');
        }
        if (needsUpdate(lastUpdated.weather)) {
            fetchData('http://127.0.0.1:5000/weather', setWeatherData, 'weather');
        }
    }, [lastUpdated,]); // Empty dependency array to run only once after mount

    return (
        <AppContext.Provider value={{ flightsData, newsData, weatherData, hasHeader, setHasHeader, selectedService, setSelectedService }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
