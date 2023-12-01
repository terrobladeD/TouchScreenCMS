import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import AppContext from '../context/AppContext.js';

const NewsContent = () => {
    const { newsData } = useContext(AppContext);
    const [isSlowConnection, setIsSlowConnection] = useState(false);

    useEffect(() => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            if (connection.downlink < 1.5) { // lower 1.5mbps will be considered low
                setIsSlowConnection(true);
            }
        }
    }, []);

    return (
        <div className='main-content' style={{ overflow: 'scroll' }}>
            {newsData ? newsData.map((newsItem, index) => (
                <Row key={index} style={{ width: '100%', height: '25vw', borderBottom: '0.1rem solid white', padding: '1rem', color: 'white' }}>
                    <Col md={7}>
                        <h2 style={{ margin: '0 0 2rem 0' }}>{newsItem.header}</h2>
                        <p style={{ margin: '0' }}>{newsItem.text}</p>
                    </Col>
                    <Col md={5}>
                        {isSlowConnection ? (
                            <div style={{ width: '100%', maxHeight: '100%', backgroundColor: '#ccc' }}>Image not loaded due to slow connection</div>
                        ) : (
                            <img src={newsItem.img} alt="News" style={{ width: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        )}
                    </Col>
                </Row>
            )) : <p>Loading news...</p>}
        </div>
    )
}

export default NewsContent;
