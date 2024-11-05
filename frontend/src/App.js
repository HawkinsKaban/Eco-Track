import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />          {/* Halaman Login */}
          <Route path="/register" element={<Register />} />  {/* Halaman Register */}
          <Route path="/home" element={<Home />} />         {/* Halaman Home */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
