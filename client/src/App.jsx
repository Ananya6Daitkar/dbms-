import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FloatingBackground from './components/layout/FloatingBackground';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import QueryLab from './pages/QueryLab';
import EntityBrowser from './pages/EntityBrowser';
import FunctionsPage from './pages/FunctionsPage';
import TriggerDemo from './pages/TriggerDemo';

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-space-dark text-white">
        <FloatingBackground />
        <Navbar />
        
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/query-lab" element={<QueryLab />} />
            <Route path="/entities" element={<EntityBrowser />} />
            <Route path="/functions" element={<FunctionsPage />} />
            <Route path="/trigger-demo" element={<TriggerDemo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
