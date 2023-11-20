import React, { useEffect } from 'react';
import './App.css'; // Make sure to include your global styles as well
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { AppProvider } from './context/AppContext';
import MainPage from './pages/MainPage.js';
// import ContentPage from './pages/ContentPage.js';

function App() {

  useEffect(() => {
    const handleRightClick = (event) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleRightClick);

    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  return (
    <AppProvider>
      <Router>

        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>

      </Router>
    </AppProvider>
  );
}

export default App;
