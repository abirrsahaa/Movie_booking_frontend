import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parse, isAfter, isBefore, format } from "date-fns";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import axios from 'axios';
import { useAppSelector } from "@/store/store";

// Types to match your backend models
interface Users {
  id: number;
  username: string;
}

interface ShowTime {
  id: number;
  movie: {
    title: string;
    poster: string;
    genre: string;
    duration: number;
    rating: number;
  };
  theater: {
    name: string;
    location: string;
  };
  showDateTime: string;
}

interface Booking {
  id: number;
  user: Users;
  showtime: ShowTime;
  amount: number;
  booking_date: string;
  seatIds: string;
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
  const { userData, isAuthenticated, isLoading, error } = useAppSelector((state) => state.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/getBooking/${userData?.id}`);
        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setBookings([]);
        }
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

  const formatSeats = (seatIds: string): string => {
    return seatIds.replace(/Row: |Number: |;/g, '').replace(',', ', ');
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await axios.post(`/api/bookings/${bookingId}/cancel`);
      setBookings(bookings.filter(b => b.id !== bookingId));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  // Empty state component
  const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  // Render a single booking card
  const renderBookingCard = (booking: Booking) => {
    const showDate = new Date(booking.showtime.showDateTime);
    const isPastBooking = isBefore(showDate, new Date());

    return (
      <motion.div
        key={booking.id}
        variants={itemVariants}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
          isPastBooking ? 'opacity-60' : ''
        }`}
      >
        <Card>
          <CardHeader>
            {/* <CardTitle>{booking.showtime.movie.title}</CardTitle> */}
            {/* <CardDescription>
              {format(showDate, "EEEE, MMMM d, yyyy")} • 
              {format(showDate, "HH:mm")}
              {isPastBooking && (
                <span className="ml-2 text-muted-foreground text-xs">(Completed)</span>
              )}
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <img
                // src={booking.showtime.movie.poster}
                // alt={booking.showtime.movie.title}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <p className="text-sm text-muted-foreground">
                  {/* {booking.showtime.theater.name} • {booking.showtime.theater.location} */}
                </p>
                <p className="text-sm text-muted-foreground">
                  Seats: {formatSeats(booking.seatIds)}
                </p>
              </div>
            </div>
          </CardContent>
          {!isPastBooking && (
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveBooking(booking);
                    setIsDialogOpen(true);
                  }}
                >
                  Cancel Booking
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <motion.h1
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          My Bookings
        </motion.h1>
        <motion.p
          className="text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          View and manage your movie tickets and bookings
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        {bookings.length > 0 ? (
          <motion.div
            key="bookings-list"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-4"
          >
            {bookings.map(booking => renderBookingCard(booking))}
          </motion.div>
        ) : (
          <EmptyState message="You don't have any movie bookings. Browse our latest movies and book your next cinema experience!" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;