// /src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import EventsList from './components/EventsList';
import CreateEvent from './components/CreateEvent';
import EventQRCode from './components/EventQRCode';
import ConfessionList from './components/ConfessionList'; // Import du composant ConfessionList

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events/:id/qrcode" element={<EventQRCode />} />
        <Route path="/confessions" element={<ConfessionList />} /> {/* Nouvelle route pour ConfessionList */}
      </Routes>
    </Router>
  );
}

export default App;
