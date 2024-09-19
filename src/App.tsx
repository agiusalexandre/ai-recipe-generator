// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import PersistPage from './pages/PersistPage'; 
import UploadPage from './pages/UploadPage';

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/Upload">Upload</Link> | <Link to="/Persist">Persist</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Upload" element={<UploadPage />} />
        <Route path="/Persist" element={<PersistPage />} />
      </Routes>
    </Router>
  );
};

export default App;
