import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../context/AppContext.js';
import NewsDetail from './NewsDetail';

const NewsContent = () => {
    const { newsData } = useContext(AppContext);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isSlowConnection, setIsSlowConnection] = useState(false);

    useEffect(() => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        // console.log(connection);
        if (connection) {
            if (connection.downlink < 1) { // lower 1mbps will be considered low
                setIsSlowConnection(true);
            }
        }
    }, []);

    const handleNewsClick = (newsItem) => {
        setSelectedNews(newsItem);
    };

    const handleBackClick = () => {
        setSelectedNews(null);
    };

    return (
        <div className='main-content scroll-list' style={{ overflowY: 'scroll' }}>
            {!selectedNews ? (
                newsData ? newsData.map((newsItem, index) => (
                    <div key={index} style={{ display: "flex", width: '100%', height: '15rem', borderBottom: '0.1rem solid white', padding: '1rem', color: 'white' }}
                        onClick={() => handleNewsClick(newsItem)}>
                        <div style={{ width: '70%', padding: '0 4rem 0 0' }}>
                            <p style={{ margin: '0 0 2rem 0', fontSize: '1.5rem' }}>{newsItem.header}</p>
                            <p style={{ margin: '0' }}>{newsItem.text}</p>
                        </div>
                        <div style={{ width: '30%' }}>
                            {isSlowConnection ? (
                                <div style={{ width: '100%', maxHeight: '100%', backgroundColor: '#ccc' }}>Image not loaded due to slow connection</div>
                            ) : (
                                <img src={newsItem.img} alt="News" style={{ width: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            )}
                        </div>
                    </div>
                )) : <p>Loading news...</p>
            ) : (
                <NewsDetail newsItem={selectedNews} isSlowConnection={isSlowConnection} onBackClick={handleBackClick} />
            )}
        </div>
    )
}

export default NewsContent;
