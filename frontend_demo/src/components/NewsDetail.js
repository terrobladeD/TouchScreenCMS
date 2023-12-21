import React, {useEffect} from 'react';

const NewsDetail = ({ newsItem, isSlowConnection, onBackClick }) => {
    useEffect(() => {
        const contentList = document.querySelector('.main-content');
        if (contentList) {
            contentList.scrollTop = 0;
        }
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white" }}>
            <div style={{ display: "flex", alignItems: "center", width: '100%', justifyContent: "flex-start" }}>
                <img src={`${process.env.PUBLIC_URL}/images/main/back_icon.png`} alt="back-button" style={{ width: '5rem', cursor: 'pointer' }} onClick={onBackClick} />
                <span style={{ fontSize: '3rem', marginLeft: '1rem' }}>{newsItem.header}</span>
            </div>
            {isSlowConnection ? (
                <div style={{ width: '80%', height: '300px', backgroundColor: '#ccc', display: "flex", alignItems: "center", justifyContent: "center" }}>
                    Image not loaded due to slow connection
                </div>
            ) : (
                <img src={newsItem.img} alt={newsItem.header} style={{ width: '60%', maxHeight: '300px', objectFit: 'contain' }} />
            )}
            <p style={{ width: '90%', whiteSpace: "pre-line", marginTop: '2rem' }}>{newsItem.content}</p>
        </div>
    );
}

export default NewsDetail;
