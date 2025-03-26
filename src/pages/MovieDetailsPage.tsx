import React, { useEffect, useState } from 'react';
import TabsSection from '@/components/MovieDetailsPage/TabsSection';
import HeroSection from '@/components/MovieDetailsPage/HeroSection';
import { slideUp, staggerChildren } from '@/framer-motion/variants';
import { Cinema, HomePageMovie, MovieDetailsPageProps, Showtime } from '@/interfaces/interfaces_All';
import SeatSelectionComponent from '@/components/MovieDetailsPage/SeatSelectionComponent';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { set } from 'date-fns';

const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({ dates, cinemas }) => {
  const { id } = useParams<{ id: string }>(); // Get the id from the URL
  const movieId = Number(id);
const [movie,setMovie]=useState<HomePageMovie|null>(null);


  useEffect(() => {
    const getting=async()=>{
      const movieGetting=await axios.get("http://localhost:9090/getMovieById/"+movieId);
      console.log(movieGetting.data);
      setMovie(movieGetting.data);
    }
    getting();
  },[])

  // movie mujhe diya nahi jayega movie mangwaya jayega 
      const [seatSelectionOpen, setSeatSelectionOpen] = useState(false);
      const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
      const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  // Handle showtime selection
  const handleShowtimeClick = (cinema: Cinema, showtime: Showtime) => {
    setSelectedCinema(cinema);
    setSelectedShowtime(showtime);
    setSeatSelectionOpen(true);
  };

  if(!movie)return;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Hero Section with Parallax Banner */}
     <HeroSection movie={movie} />
     <div className="container mx-auto py-6 px-4">
      {/* the tab section is not very important to modify i can do that at will  */}
        <TabsSection
          movie={movie}
          dates={dates}
          cinemas={cinemas}
      
          onShowtimeSelect={handleShowtimeClick}
          staggerChildren={staggerChildren}
          slideUp={slideUp}
        />
      </div>
      <SeatSelectionComponent
        movie={movie}
        cinema={selectedCinema}
        showtime={selectedShowtime}
        open={seatSelectionOpen}
        onClose={() => setSeatSelectionOpen(false)}
      />
    </div>
  );
};

export default MovieDetailsPage;