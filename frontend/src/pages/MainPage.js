import React from 'react';
import Header from '../components/Header.js';
import MainContent from '../components/MainContent.js';
import Footer from '../components/Footer.js';

const MainPage = () => {
    return (
        <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
            <Header />
            <MainContent />
            <Footer />
        </div>
    )
}

export default MainPage;