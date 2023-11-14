import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext.js';

const Header = () => {

    const [dateTime, setDateTime] = useState('');
    const [weather, setWeather] = useState([]);
    const [services, setServices] = useState([
        { name: 'SERVICES', icon: 'services_icon.png', page: '01000000' },
        { name: 'MAPS', icon: 'maps_icon.png', page: '02000000' },
        { name: 'ACTIVITIES', icon: 'activities_icon.png', page: '03000000' },
        { name: 'DESTINATIONS', icon: 'destionations_icon.png', page: '04000000' },
        { name: 'EVENTS', icon: 'events_icon.png', page: '05000000' },
        { name: 'EATING OUT', icon: 'eating_out_icon.png', page: '06000000' },
        { name: 'OUR HOTEL', icon: 'accomodation_icon.png', page: '07000000' }
    ]);
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState('dateTime');
    const [currentFlightDisplay, setCurrentFlightDisplay] = useState("");
    const { selectedService, setSelectedService, weatherData, flightsData } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (weatherData && weatherData.length) {
            const formattedWeatherData = weatherData.map(item => {
                const date = new Date(item.date);
                const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}`;
                const weatherCondition = item.condition.text;
                const tempRange = `${item.mintemp_c}\u2103 - ${item.maxtemp_c}\u2103`;
                return `${formattedDate} ${weatherCondition} ${tempRange}`;
            });
            setWeather(formattedWeatherData);
        }
    }, [weatherData]);

    useEffect(()=>{console.log("rendered")},[])


    const handleServiceClick = service => {
        setSelectedService(service.name);

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
        // then do the navigation
        navigate(`/page/${service.page}`)
    };

    const handleServiceReset = () => {
        setServices(
            [
                { name: 'SERVICES', icon: 'services_icon.png', page: '01000000' },
                { name: 'MAPS', icon: 'maps_icon.png', page: '02000000' },
                { name: 'ACTIVITIES', icon: 'activities_icon.png', page: '03000000' },
                { name: 'DESTINATIONS', icon: 'destionations_icon.png', page: '04000000' },
                { name: 'EVENTS', icon: 'events_icon.png', page: '05000000' },
                { name: 'EATING OUT', icon: 'eating_out_icon.png', page: '06000000' },
                { name: 'OUR HOTEL', icon: 'accomodation_icon.png', page: '07000000' }
            ]
        );
        setSelectedService(null);
        navigate("/");
    }

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const amPm = hours >= 12 ? 'PM' : 'AM';
            // Convert 24h hour to 12h format
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const minutes = now.getMinutes().toString().padStart(2, '0');
            // Formatting the date as dd-MM-yyyy
            const date = now.getDate().toString().padStart(2, '0');
            // Array of month names
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            // Get the month name from the array using the month number as an index
            const month = monthNames[now.getMonth()];
            const year = now.getFullYear();
            const formattedDateTime = `${hours}:${minutes} ${amPm} | ${date}-${month}-${year}`;
            setDateTime(formattedDateTime);
        };

        // Update the date and time now, and then every 5 seconds
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 5000);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, []);


    // flipping displays
    useEffect(() => {
        const intervals = ['dateTime', 0, 'dateTime', 1, 'dateTime', 2]
        let currentIndex = 0;

        const updateDisplay = () => {
            setCurrentTimeDisplay(intervals[currentIndex]);
            currentIndex = (currentIndex + 1) % intervals.length;
        };

        updateDisplay();
        const intervalId = setInterval(updateDisplay, 3000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (flightsData && flightsData.length) {
            let interval = 0
            const updateDisplay = () => {
                const time = flightsData[interval].departure.estimated.split('T')[1].substring(0, 5); // Extract HH:mm
                let [hours, minutes] = time.split(':').map(Number); // Convert to numbers
                hours += 10; // Add 10 hours
                // Handle day rollover
                let dayRollover = '';
                if (hours >= 24) {
                    hours -= 24;
                    dayRollover = ' (+1)';
                }
                // Format hours and minutes
                const formattedHours = hours.toString().padStart(2, '0');
                const formattedMinutes = minutes.toString().padStart(2, '0');

                setCurrentFlightDisplay(
                    `${flightsData[interval].flight.iata}: ${flightsData[interval].departure.iata}→${flightsData[interval].arrival.iata} ${formattedHours}:${formattedMinutes}${dayRollover}`
                )
                interval = (interval + 1) % flightsData.length;
            };
            updateDisplay();
            const intervalId = setInterval(updateDisplay, 5000);

            return () => clearInterval(intervalId);
        }
    }, [flightsData])

    return (
        <header style={{ height: !selectedService ? '66.7vw' : '52.7vw' }}>
            {!selectedService &&
                <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/main/touch_and_explore_banner.jpg)`, backgroundSize: 'cover', height: '14vw' }}>
                </div>}

            <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/main/hotel_logo.png)`, backgroundSize: 'cover', height: '29.3vw' }}
                onClick={() => handleServiceReset()}>
            </div>
            <div className="flex-column w-100" style={{ height: '23.3vw', color: 'white' }}>
                <div className="d-flex justify-content-around w-100 align-items-center" style={{ height: '26%', fontSize: '2rem' }}>
                    <span className="d-flex flex-column align-items-center justify-content-center header-nav-icon" style={{ height: '100%', width: '100%' }}
                        onClick={() => { navigate("/flights"); setSelectedService(null) }}>
                        {flightsData && flightsData.length !== 0 &&
                            <span key={currentFlightDisplay} className="flip-animation">
                                {currentFlightDisplay}
                            </span>}
                    </span>
                    <span className="d-flex flex-column align-items-center justify-content-center header-nav-icon-selected" style={{ height: '100%', width: '100%' }}>
                        {currentTimeDisplay === 'dateTime' && <span className="flip-animation">{dateTime}</span>}
                        {typeof currentTimeDisplay === 'number' && <span className="flip-animation">{weather[currentTimeDisplay]}</span>}
                    </span>
                </div>
                <div className="d-flex justify-content-around w-100 align-items-center header-nav-icon" style={{ height: '74%' }}>
                    {services.map((service) => (
                        <span
                            key={service.name}
                            className={`d-flex flex-column align-items-center justify-content-around header-nav-icon ${selectedService === service.name ? 'header-nav-icon-selected' : ''}`}
                            style={{ height: '100%', width: '100%', padding: '1rem 0 1rem 0' }}
                            onClick={() => handleServiceClick(service)}
                        >
                            <img
                                src={`${process.env.PUBLIC_URL}/images/main/${service.icon}`}
                                alt={service.name.toLowerCase()}
                                style={{ width: '4rem', height: '4rem' }}
                            />
                            <span>{service.name}</span>
                        </span>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
