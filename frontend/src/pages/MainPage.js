import React from 'react';
import Header from '../components/Header.js';
import HomeContent from '../components/HomeContent.js';
import Footer from '../components/Footer.js';

const MainPage = () => {
    return (
        <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
            <Header />
            <HomeContent />
            <Footer />
        </div>
    )
}

export default MainPage;