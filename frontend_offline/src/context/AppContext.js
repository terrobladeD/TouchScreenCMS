import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { Themes } from './Themes.js';
const AppContext = createContext();

const TIMER_RESET = 90; // time to make a new reuqest in min
const TIMER_REFRESH = 60; // time to refresh to main in sec

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('crown_hotel'); // default theme
    // const theme = 'holidayinn_hotel'; // default theme
    const [selectedService, setSelectedService] = useState(null);
    const [flightsData, setFlightsData] = useState(null);
    const [newsData, setNewsData] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [globalId, setGlobalId] = useState("");
    const [lastUpdated, setLastUpdated] = useState({
        flights: null,
        news: null,
        weather: null,
    });
    const [generalData, setGeneralData] = useState(null);
    const [videoSources, setVideoSources] = useState([])
    const [services, setServices] = useState([
        { name: 'SERVICES', icon: 'services_icon.png', globalId: '01000000' },
        { name: 'MAPS', icon: 'maps_icon.png', globalId: '02000000' },
        { name: 'ACTIVITIES', icon: 'activities_icon.png', globalId: '03000000' },
        { name: 'DESTINATIONS', icon: 'destionations_icon.png', globalId: '04000000' },
        { name: 'EVENTS', icon: 'events_icon.png', globalId: '05000000' },
        { name: 'EATING OUT', icon: 'eating_out_icon.png', globalId: '06000000' },
        { name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' }
    ]);


    useEffect(() => {
        const root = document.documentElement;
        const themeVars = Themes[theme];
        Object.keys(themeVars).forEach(key => {
            root.style.setProperty(key, themeVars[key]);
        });
    }, [theme]);

    useEffect(() => {
        const apiUrl = `${process.env.PUBLIC_URL}/datas/general.json`;
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setGeneralData(data);
                // console.log(data);
            })
        const hotelURL = `${process.env.PUBLIC_URL}/datas/hotel.json`;
        fetch(hotelURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setVideoSources(data[0]["hotel_videos"]);
                setTheme(data[0]["hotel_id"])
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
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/flights`);
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
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/news`);
                if (!response.ok) throw new Error('Network response was not ok for news');
                const newsData = await response.json();
                setNewsData(newsData);
                setLastUpdated(prev => ({ ...prev, news: new Date() }));
                // Add any specific handling for news data here
            } catch (error) {
                console.error('Fetch error for news:', error);
                setTimeout(fetchNewsData, TIMER_RESET * 1000);
            }
        };

        // Fetch Weather Data
        const fetchWeatherData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/weather`);
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

    // Timer to refresh every 60s
    const timerId = useRef(null);
    const refreshPage = useCallback(() => {
        handleServiceReset();
    }, []);
    const resetTimer = useCallback(() => {
        if (timerId.current) {
            clearTimeout(timerId.current);
        }
        if (selectedService !== null) {
            timerId.current = setTimeout(refreshPage, TIMER_REFRESH * 1000);
        }
    }, [selectedService, refreshPage]);

    const handleServiceClick = service => {
        setSelectedService(service.name);
        setGlobalId(service.globalId)

        // Reorder services to put the clicked service in the middle
        const index = services.findIndex(s => s.name === service.name);
        const middleIndex = 3;
        if (index < middleIndex) {
            // Move selected service to the middle from start
            const firstHalf = services.slice(0, 4 + index);
            const secondHalf = services.slice(4 + index);
            setServices([...secondHalf, ...firstHalf,]);
        } else if (index > middleIndex) {
            // Move selected service to the middle from end
            const firstHalf = services.slice(0, index - 3);
            const secondHalf = services.slice(index - 3);
            setServices([...secondHalf, ...firstHalf]);
        }
        // If it's already in the middle, do nothing
    };

    const handleServiceReset = () => {
        setServices(
            [
                { name: 'SERVICES', icon: 'services_icon.png', globalId: '01000000' },
                { name: 'MAPS', icon: 'maps_icon.png', globalId: '02000000' },
                { name: 'ACTIVITIES', icon: 'activities_icon.png', globalId: '03000000' },
                { name: 'DESTINATIONS', icon: 'destionations_icon.png', globalId: '04000000' },
                { name: 'EVENTS', icon: 'events_icon.png', globalId: '05000000' },
                { name: 'EATING OUT', icon: 'eating_out_icon.png', globalId: '06000000' },
                { name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' }
            ]
        );
        setSelectedService(null);
        setGlobalId(null);
    }

    useEffect(() => {
        resetTimer();

        const handleUserActivity = () => resetTimer();
        window.addEventListener('mousemove', handleUserActivity);

        return () => {
            clearTimeout(timerId.current);
            window.removeEventListener('mousemove', handleUserActivity);
        };
    }, [resetTimer]);


    return (
        <AppContext.Provider value={{ generalData, flightsData, newsData, weatherData, videoSources, selectedService, setSelectedService, globalId, setGlobalId, services, setServices, handleServiceReset, handleServiceClick }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
