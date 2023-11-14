import React from 'react';
import './App.css'; // Make sure to include your global styles as well
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { AppProvider } from './context/AppContext';
import MainPage from './pages/MainPage.js';
import NewsPage from './pages/NewsPage.js';
import FlightsPage from './pages/FlightsPage.js';
import ContentPage from './pages/ContentPage.js';

function App() {
  return (
    <AppProvider>
      <Router>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/page/:globalId" element={<ContentPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/flights" element={<FlightsPage />} />
        </Routes>

      </Router>
    </AppProvider>
  );
}

export default App;
