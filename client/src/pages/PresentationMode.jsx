import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    title: 'Food Delivery Query Lab',
    subtitle: 'A Visual Control Room for PostgreSQL Analysis',
    content: 'An immersive database exploration tool built for academic demonstration'
  },
  {
    title: 'Dashboard Overview',
    subtitle: 'Real-time KPIs and Analytics',
    content: 'Track active orders, delivery times, and restaurant metrics with animated charts'
  },
  {
    title: 'Query Lab',
    subtitle: 'Interactive SQL Execution',
    content: '15 predefined queries covering simple and complex SQL patterns with live results'
  },
  {
    title: 'Entity Browser',
    subtitle: 'Database Table Explorer',
    content: 'Browse all 8 entities with search and filter capabilities'
  },
  {
    title: 'PL/pgSQL Functions',
    subtitle: 'Database Function Execution',
    content: 'Execute stored procedures and view computed results'
  },
  {
    title: 'Trigger Demonstration',
    subtitle: 'Real-time Database Triggers',
    content: 'Simulate payment events and observe automatic status updates'
  }
];

export default function PresentationMode() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        navigate('/');
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);
  
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-space-dark z-50 flex flex-col">
      {/* Exit Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold neon-text mb-6">
              {slides[currentSlide].title}
            </h1>
            <p className="text-2xl md:text-3xl text-neon-blue mb-8">
              {slides[currentSlide].subtitle}
            </p>
            <p className="text-xl md:text-2xl text-gray-400">
              {slides[currentSlide].content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between px-8 py-6">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="p-4 rounded-lg border border-gray-700 hover:border-neon-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <div className="flex items-center gap-4">
          <span className="text-lg text-gray-400">
            {currentSlide + 1} / {slides.length}
          </span>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-neon-blue' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          className="p-4 rounded-lg border border-gray-700 hover:border-neon-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
