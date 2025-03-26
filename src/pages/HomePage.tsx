import { useState, useEffect } from 'react';
import axios from "axios";
import HeroSection from '@/components/HomePage/HeroSection';
import NowShowing from '@/components/HomePage/NowShowing';
import ComingSoon from '@/components/HomePage/ComingSoon';
import OffersAndPromotions from '@/components/HomePage/OffersAndPromotions';
import BrowseByCategory from '@/components/HomePage/BrowseByCategory';
import QuickLinks from '@/components/HomePage/QuickLinks';
import AppDownload from '@/components/HomePage/AppDownload';
import Footer from '@/components/HomePage/Footer';
import { containerVariants, fadeInVariants, itemVariants } from '@/framer-motion/variants';
import { useNavigate } from 'react-router-dom';



const HomePage = () => {

  // Parallax effect for the hero section
  const [scrollY, setScrollY] = useState(0);

  const navigate = useNavigate();

  // Check for existing token on component mount
  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          // If token exists, redirect to main page
          navigate('/login');
      }
  }, [navigate]);
  
  useEffect(() => {
    const aesehi=async ()=>{
      const getting=await axios.get("http://localhost:9090/hello");
      console.log(getting.data);
    }
    aesehi();
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection scrollY={scrollY} />

      {/* Now Showing Movies */}
      <NowShowing  containerVariants={containerVariants} itemVariants={itemVariants} />

      {/* Coming Soon */}
      <ComingSoon  containerVariants={containerVariants} itemVariants={itemVariants} />


      {/* Browse by Category */}
      <BrowseByCategory containerVariants={containerVariants} itemVariants={itemVariants} />

      {/* Offers and Promotions */}
      <OffersAndPromotions  containerVariants={containerVariants} itemVariants={itemVariants} />

      {/* Quick Links */}
      <QuickLinks fadeInVariants={fadeInVariants} containerVariants={containerVariants} itemVariants={itemVariants}  />

      {/* App Download Section */}
     <AppDownload />

      {/* Footer */}
     <Footer/>

      </div>
    );
};

export default HomePage;