import React, { useState, useEffect, useContext  } from 'react';
import AppContext from '../context/AppContext.js'; 

const Header = () => {

    const [dateTime, setDateTime] = useState('');
    const [services, setServices] = useState([
        { name: 'SERVICES', icon: 'services_icon.png' },
        { name: 'MAPS', icon: 'maps_icon.png' },
        { name: 'ACTIVITIES', icon: 'activities_icon.png' },
        { name: 'DESTINATIONS', icon: 'destionations_icon.png' },
        { name: 'EVENTS', icon: 'events_icon.png' },
        { name: 'EATING OUT', icon: 'eating_out_icon.png' },
        { name: 'OUR HOTEL', icon: 'accomodation_icon.png' }
    ]);
    const {selectedService, setSelectedService} = useContext(AppContext);

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
    };

    const handleServiceReset = () => {
        setServices(
            [
                { name: 'SERVICES', icon: 'services_icon.png' },
                { name: 'MAPS', icon: 'maps_icon.png' },
                { name: 'ACTIVITIES', icon: 'activities_icon.png' },
                { name: 'DESTINATIONS', icon: 'destionations_icon.png' },
                { name: 'EVENTS', icon: 'events_icon.png' },
                { name: 'EATING OUT', icon: 'eating_out_icon.png' },
                { name: 'OUR HOTEL', icon: 'accomodation_icon.png' }
            ]
        );
        setSelectedService(null);
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

    return (
        <header style={{ height: '52.7vw' }}>

            <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/main/hotel_logo.png)`, backgroundSize: 'cover', height: '55.7%' }}
                onClick={() => handleServiceReset()}>
            </div>
            <div className="flex-column w-100" style={{ height: '44.3%', color: 'white' }}>
                <div className="d-flex justify-content-around w-100 align-items-center" style={{ height: '26%', fontSize: '2rem' }}>
                    <span className="d-flex flex-column align-items-center justify-content-center header-nav-icon" style={{ height: '100%', width: '100%' }}>
                        <span>FLIGHT FLIGHT FLIGHT</span>
                    </span>
                    <span className="d-flex flex-column align-items-center justify-content-center header-nav-icon-selected" style={{ height: '100%', width: '100%' }}>
                        <span>{dateTime}</span>
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
