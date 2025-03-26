import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HomePageMovie } from '@/interfaces/interfaces_All';
import axios from 'axios';

// Hero section with slider
const HeroSection: React.FC = () => {
  const [nowShowing, setNowShowing] = useState<HomePageMovie[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch movies on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:9090/nowShowing");
        const movies = response.data.slice(0, 3);
        setNowShowing(movies);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (nowShowing.length === 0) return;

    let intervalId: NodeJS.Timeout;
    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % nowShowing.length);
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isAutoPlaying, nowShowing.length]);

  // Slide navigation handlers
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % nowShowing.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + nowShowing.length) % nowShowing.length);
    setIsAutoPlaying(false);
  };

  // Slide variants for animation
  const slideVariants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 1,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { 
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl text-white">Loading movies...</p>
      </div>
    );
  }

  // No movies found
  if (nowShowing.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl text-white">No movies available</p>
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <AnimatePresence mode="wait">
      <motion.div
  key={nowShowing[currentSlide].id}
  className="absolute inset-0 bg-cover bg-center z-0"
  style={{ 
    backgroundImage: `url(${nowShowing[currentSlide].image})`,
    backgroundSize: 'cover', // Ensures the image covers the entire section
    backgroundPosition: 'center', // Centers the image
  }}
  initial={{ scale: 1.2, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 1.2, opacity: 0 }}
  transition={{ duration: 1.2, ease: "easeInOut" }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/60" />
</motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={nowShowing[currentSlide].id}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideVariants}
            className="max-w-4xl space-y-6"
          >
            {/* Movie Meta Information */}
            <div className="flex items-center space-x-4 text-white/80">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                {nowShowing[currentSlide].type}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-tight">
              {nowShowing[currentSlide].title}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <button 
          className="text-white/50 hover:text-white transition-colors duration-300"
          onClick={prevSlide}
        >
          <ChevronLeft size={48} strokeWidth={1.5} />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <button 
          className="text-white/50 hover:text-white transition-colors duration-300"
          onClick={nextSlide}
        >
          <ChevronRight size={48} strokeWidth={1.5} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {nowShowing.map((_, index) => (
          <motion.div
            key={index}
            className={`w-4 h-1.5 rounded-full cursor-pointer ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
            animate={{
              width: index === currentSlide ? 32 : 16,
              transition: { duration: 0.3 }
            }}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;