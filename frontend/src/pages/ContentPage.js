import React from 'react';
import Header from '../components/Header.js';
import GeneralContent from '../components/GeneralContent.js'
import Footer from '../components/Footer.js';

const ContentPage = () => {
    return (
        <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
            <Header />
            <GeneralContent />
            <Footer />
        </div>
    )
}

export default ContentPage;