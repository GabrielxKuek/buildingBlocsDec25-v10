
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TestPage from './pages/TestPage';
import ErrorPage from './pages/ErrorPage';
import Dashboard from './pages/Dashboard';
import Statspage from './pages/userstats';
import Map from "./pages/Map";
import Events from "./pages/Events";
import MapViewerPage from "./pages/MapViewerPage";
import Navbar from './components/Navbar';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-16">
        
        {/* Main Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<Map />} />
          <Route path="/map-viewer" element={<MapViewerPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/stats" element={<Statspage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>

        {/* Bottom Navigation Bar */}
        <Navbar />
      </div>
    </BrowserRouter>
  );
}

export default App;