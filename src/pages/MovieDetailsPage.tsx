import React, { useState } from 'react';
import TabsSection from '@/components/MovieDetailsPage/TabsSection';
import HeroSection from '@/components/MovieDetailsPage/HeroSection';
import { slideUp, staggerChildren } from '@/framer-motion/variants';
import { Cinema, MovieDetailsPageProps, Showtime } from '@/interfaces/interfaces_All';
import SeatSelectionComponent from '@/components/MovieDetailsPage/SeatSelectionComponent';

// Enhanced MovieDetailsPage with seat selection functionality
const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({ movie, dates, cinemas, reviews, offers }) => {
      const [seatSelectionOpen, setSeatSelectionOpen] = useState(false);
      const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
      const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  // Handle showtime selection
  const handleShowtimeClick = (cinema: Cinema, showtime: Showtime) => {
    setSelectedCinema(cinema);
    setSelectedShowtime(showtime);
    setSeatSelectionOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Hero Section with Parallax Banner */}
     <HeroSection movie={movie} />
     <div className="container mx-auto py-6 px-4">
        <TabsSection
          movie={movie}
          dates={dates}
          cinemas={cinemas}
          reviews={reviews}
          offers={offers}
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