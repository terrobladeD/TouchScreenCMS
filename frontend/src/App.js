import React from 'react';
import Header from './components/Header.js';
import MainContent from './components/MainContent.js';
import Footer from './components/Footer.js';
import './App.css'; // Make sure to include your global styles as well

function App() {
  return (
    <div className="App">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;
