import React from 'react';
import './App.css'; // Make sure to include your global styles as well
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage.js'
import NewsPage from './pages/NewsPage.js'

function App() {
  return (
    <main>
    <Router>

      <Container>
        <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/news" element={<NewsPage />} />
        </Routes>
      </Container>

    </Router>
  </main>
  );
}

export default App;
