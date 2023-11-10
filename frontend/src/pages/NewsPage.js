import React, { useContext } from 'react';
import {Row, Col} from 'react-bootstrap';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

import AppContext from '../context/AppContext.js';

const NewsPage = () => {

    const { newsData } = useContext(AppContext);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <div className='main-content' style={{ overflow: 'scroll' }}>
                {newsData ? newsData.map((newsItem, index) => (
                    <Row key={index} style={{width: '100%', height: '25vw', borderBottom: '0.1rem solid white', padding: '1rem', color: 'white' }}>
                        <Col md={7}>
                            <h2 style={{ margin: '0 0 2rem 0' }}>{newsItem.header}</h2>
                            <p style={{ margin: '0' }}>{newsItem.text}</p>
                        </Col>
                        <Col md={5}>
                            <img src={newsItem.img} alt="News" style={{ width: '100%',maxHeight:'100%', objectFit: 'contain' }} />
                        </Col>
                    </Row>
                )) : <p>Loading news...</p>}
            </div>
            <Footer />
        </div>
    )
}

export default NewsPage;