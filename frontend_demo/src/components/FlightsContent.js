import React, { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import AppContext from '../context/AppContext.js';

const FlightsPage = () => {
    const { flightsData } = useContext(AppContext);

    // Function to add 10 hours to the given time
    const addTenHours = (timeString) => {
        if (!timeString) return 'N/A';

        const time = timeString.split('T')[1].substring(0, 5); // Extract HH:mm
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

        return `${formattedHours}:${formattedMinutes}${dayRollover} (UTC+10)`;
    };

    return (
        <div className='main-content scroll-list' style={{ overflowY: 'scroll' }}>
            {flightsData ? flightsData.map((flight, index) => (
                <Row key={index} style={{ width: '100%', fontSize: '1.5rem', borderBottom: '0.1rem solid white', padding: '1rem', color: 'white' }}>
                    <Col>
                        <div>
                            <strong>{flight.flight.iata} / {flight.flight.icao}</strong>
                            &nbsp;&nbsp;&nbsp;{flight.departure.iata} {'->'} {flight.arrival.iata}
                        </div>
                        <div>

                        </div>
                        <div>
                            {addTenHours(flight.departure.estimated)} {' - '}
                            {addTenHours(flight.arrival.estimated)}
                        </div>
                    </Col>
                </Row>
            )) : <p>Loading flights...</p>}
        </div>
    )
}

export default FlightsPage;
