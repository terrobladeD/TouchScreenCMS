import React, { useContext } from 'react';
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
                    <div key={index} style={{ display: 'flex', width: '100%', height: '25vw', borderBottom: '0.1rem solid white', padding: '1rem', color: 'white' }}>
                        <div style={{ flex: 14 }}>
                            <h2 style={{ margin: '0 0 2rem 0' }}>{newsItem.header}</h2>
                            <p style={{ margin: '0' }}>{newsItem.text}</p>
                        </div>
                        <div style={{ flex: 1 }} > &nbsp;</div>
                        <div style={{ flex: 10 }}>
                            <img src={newsItem.img} alt="News" style={{ width: '100%',maxHeight:'100%', objectFit: 'contain' }} />
                        </div>
                    </div>
                )) : <p>Loading news...</p>}
            </div>
            <Footer />
        </div>
    )
}

export default NewsPage;