import React, { useContext } from 'react';
import Header from '../components/Header.js';
import HomeContent from '../components/HomeContent.js';
import GeneralContent from '../components/GeneralContent.js';
import NewsContent from '../components/NewsContent.js';
import FlightsContent from '../components/FlightsContent.js';
import Footer from '../components/Footer.js';
import AppContext from '../context/AppContext.js';

const MainPage = () => {
    const { selectedService } = useContext(AppContext);
    function renderContent(selectedService) {
        switch (selectedService) {
            case "News":
                return <NewsContent />;
            case "Flights":
                return <FlightsContent />;
            default:
                return <GeneralContent />;
        }
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header />
            {selectedService ? renderContent(selectedService) : <HomeContent />}
            <Footer />
        </div>
    )
}

export default MainPage;