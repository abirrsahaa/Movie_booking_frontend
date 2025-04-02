import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, isBefore } from "date-fns";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TicketIcon, MapPinIcon, CalendarIcon, ClockIcon, XIcon } from "lucide-react";
import axios from 'axios';
import { useAppSelector } from "@/store/store";

// Updated interfaces to match the new data structure
interface Booking {
  bookingId: number;
  seats: string;
  showtime: string;
  theatreName: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const MyBookings: React.FC = () => {
  const { userData } = useAppSelector((state) => state.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/getBooking/${userData?.id}`);
        console.log(response.data);
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setBookings([]);
        setLoading(false);
      }
    };

    if (userData?.id) {
      fetchBookings();
    }
  }, [userData]);

  // Helper function to format seats
  const formatSeats = (seats: string): string => {
    return seats.replace(/Row: |Number: |;/g, '').replace(',', ', ');
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: number) => {
    try {
      await axios.put(`http://localhost:9090/cancelBooking/${userData?.id}/${bookingId}`);
      setBookings(bookings.filter(b => b.bookingId !== bookingId));
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  // Empty state component
  const EmptyState: React.FC = () => (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <TicketIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h2>
      <p className="text-gray-500">Explore and book your favorite movies!</p>
    </div>
  );

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render booking card
  const renderBookingCard = (booking: Booking) => {
    return (
      <motion.div
        key={booking.bookingId}
        variants={itemVariants}
        className="w-full max-w-sm"
      >
        <Card className="w-full">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-blue-800">
                Movie Ticket
              </CardTitle>
              <TicketIcon className="w-6 h-6 text-blue-600" />
            </div>
          </CardHeader>
          
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <MapPinIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">
                {booking.theatreName}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">
                Date: {new Date().toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">
                Time: {booking.showtime}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <TicketIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">
                Seats: {formatSeats(booking.seats)}
              </span>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => handleCancelBooking(booking.bookingId)}
            >
              <XIcon className="mr-2 w-4 h-4" /> Cancel Booking
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your movie tickets and showtimes</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {bookings.length > 0 ? (
          <motion.div
            key="bookings-list"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-wrap justify-center items-start gap-6"
          >
            {bookings.map(booking => renderBookingCard(booking))}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;