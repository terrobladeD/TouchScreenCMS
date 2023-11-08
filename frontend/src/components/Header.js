import React, { useState } from 'react';

const Header = () => {

    const [services, setServices] = useState([
        { name: 'SERVICES', icon: 'services_icon.png' },
        { name: 'MAPS', icon: 'maps_icon.png' },
        { name: 'ACTIVITIES', icon: 'activities_icon.png' },
        { name: 'DESTINATIONS', icon: 'destionations_icon.png' },
        { name: 'EVENTS', icon: 'events_icon.png' },
        { name: 'EATING OUT', icon: 'eating_out_icon.png' },
        { name: 'OUR HOTEL', icon: 'accomodation_icon.png' }
    ]);
    const [selectedService, setSelectedService] = useState(null);

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

    return (
        <header style={{ height: '66.7vw' }}>
            <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/main/touch_and_explore_banner.jpg)`, backgroundSize: 'cover', height: '21%' }}>
            </div>

            <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/main/hotel_logo.png)`, backgroundSize: 'cover', height: '44%' }}
                onClick={() => handleServiceReset()}>
            </div>
            <div className="flex-column w-100" style={{ height: '35%', color: 'white' }}>
                <div className="d-flex justify-content-around w-100 align-items-center" style={{ height: '26%', fontSize: '2rem' }}>
                    <span className="d-flex flex-column align-items-center justify-content-center header-nav-icon" style={{ height: '100%', width: '100%' }}>
                        <span>FLIGHT FLIGHT FLIGHT</span>
                    </span>
                    <span className="d-flex flex-column align-items-center justify-content-center header-nav-icon-selected" style={{ height: '100%', width: '100%' }}>
                        <span>TIME TIME TIME</span>
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
