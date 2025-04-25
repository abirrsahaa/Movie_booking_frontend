import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from 'qrcode.react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Client as StompClient } from "@stomp/stompjs";
import {
  TicketIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  XIcon,
  DollarSignIcon,
  ChevronRightIcon,
  RefreshCcwIcon,
  Sparkles
} from "lucide-react";
import axios from 'axios';
import { useAppSelector } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SOCKET_URL } from "./AuctionDetailPage";

interface Booking {
  bookingId: number;
  seats: string;
  showtime: string;
  theatreName: string;
  movieName: string;
  movieImage: string;
  bookingStatus: string;
}

// Refined animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const cardHoverVariants = {
  hover: {
    y: -4,
    boxShadow: "0px 8px 20px rgba(0,0,0,0.06)",
    transition: { duration: 0.2 }
  }
};

const ticketVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const MyBookings: React.FC = () => {
  const { userData } = useAppSelector((state) => state.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`http://localhost:9090/getBooking/${userData?.id}`);
      console.log("Bookings:", response.data);
      setBookings(response.data);

    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchBookings();
    }
  }, [userData]);

  // WebSocket handling for broadcast updates
  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    const client = new StompClient({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      connectionTimeout: 10000,
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket server via SockJS");

      client.subscribe(`/topic/booking-transfer`, async (message) => {
        console.log("Received auction updates:", message.body);
        fetchBookings();
        toast.info("Booking updates available!", {
          duration: 4000,
          icon: <Sparkles className="h-4 w-4 text-amber-400" />
        });
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP error", frame);
      toast.error("Connection error. Please try again later.");
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const formatSeats = (seats: string): string => {
    return seats.replace(/Row: |Number: |;/g, '').replace(/,/g, ', ');
  };

  const formatShowtime = (showtime: string): { date: string, time: string } => {
    const parts = showtime.split(' ');
    return {
      date: parts[0] || new Date().toLocaleDateString(),
      time: parts[1] || showtime
    };
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await axios.put(`http://localhost:9090/cancelBooking/${userData?.id}/${bookingId}`);
      setBookings(bookings.filter(b => b.bookingId !== bookingId));
      setActiveBooking(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const createAuctionHandler = async (bookingId: number) => {
    try {
      const data = {
        bookingId: bookingId,
        userId: userData?.id,
        showtime: new Date().getTime(),
        minAmount: 200
      };

      await axios.post(
        `http://localhost:9090/auction/createAuction`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      navigate('/main/auctions');
    } catch (error) {
      console.error('Error creating auction:', error);
    }
  };

  // Empty state component
  const EmptyState: React.FC = () => (
    <motion.div
      className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <TicketIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h2>
        <p className="text-gray-500 mb-5 max-w-sm mx-auto text-sm">Explore our collection of movies and book tickets for an unforgettable cinema experience!</p>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-6 transition-all duration-200"
          onClick={() => navigate('/main/movies')}
        >
          Browse Movies
        </Button>
      </motion.div>
    </motion.div>
  );

  // Loading component with animated elements
  const LoadingState: React.FC = () => (
    <div className="flex flex-col justify-center items-center h-64">
      <motion.div
        animate={{
          rotate: 360,
          transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          }
        }}
      >
        <TicketIcon className="w-8 h-8 text-blue-400" />
      </motion.div>
      <motion.p
        className="mt-3 text-gray-500 text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Loading your bookings...
      </motion.p>
    </div>
  );

  // Ticket card component
  const TicketCard: React.FC<{ booking: Booking, isActive: boolean }> = ({ booking, isActive }) => {
    const { date, time } = formatShowtime(booking.showtime);
    console.log("Booking:", booking.bookingStatus);

    return (
      <motion.div
        variants={itemVariants}
        whileHover={cardHoverVariants.hover}
        className="w-full"
        layoutId={`ticket-${booking.bookingId}`}
      >
        <Card className="overflow-hidden border border-gray-100 rounded-lg shadow-sm">
          {/* Movie Banner Section - smaller height */}
          <div className="relative w-full h-32 overflow-hidden">
            <img
              src={booking.movieImage || "/api/placeholder/800/400"}
              alt={booking.movieName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
              <h3 className="text-white text-base font-semibold truncate">{booking.movieName}</h3>
              <div className="flex items-center">
                <MapPinIcon className="w-3 h-3 text-gray-300 mr-1" />
                <span className="text-gray-200 text-xs">{booking.theatreName}</span>
              </div>
            </div>
          </div>

          <CardContent className="p-3 space-y-3">
            {/* Date and Time - simplified layout */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-blue-500 mr-1.5" />
                <span className="text-gray-700 text-sm">{date}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 text-blue-500 mr-1.5" />
                <span className="text-gray-700 text-sm">{time}</span>
              </div>
            </div>

            {/* Seat Information - simplified */}
            <div className="flex items-start">
              <TicketIcon className="w-4 h-4 text-indigo-500 mr-1.5 mt-0.5" />
              <div>
                <span className="text-xs text-gray-500">Seats</span>
                <p className="text-sm text-gray-700">{formatSeats(booking.seats)}</p>
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="py-3 flex justify-center">
                    <motion.div
                      className="bg-gray-50 p-3 rounded-lg"
                      variants={ticketVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <QRCodeSVG
                        value={`booking:${booking.bookingId}:user:${userData?.id}`}
                        size={100}
                        className="mx-auto"
                      />
                      <p className="text-center text-xs text-gray-400 mt-2">Scan at entrance</p>
                    </motion.div>
                  </div>

                  {booking.bookingStatus == "OWNED" && <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button
                      variant="outline"
                      className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 text-xs py-1 h-auto"
                      onClick={() => createAuctionHandler(booking.bookingId)}
                    >
                      <DollarSignIcon className="w-3 h-3 mr-1" />
                      Sell Ticket
                    </Button>

                    <Button
                      variant="outline"
                      className="bg-white text-red-500 border border-red-200 hover:bg-red-50 text-xs py-1 h-auto"
                      onClick={() => handleCancelBooking(booking.bookingId)}
                    >
                      <XIcon className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="p-2 flex justify-center bg-gray-50 border-t border-gray-100">
            <Button
              variant="ghost"
              className="text-blue-500 hover:text-blue-700 text-xs font-medium flex items-center justify-center w-full h-8"
              onClick={() => setActiveBooking(isActive ? null : booking.bookingId)}
            >
              {isActive ? "Hide Details" : "View Details"}
              <motion.div
                animate={{ rotate: isActive ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </motion.div>
            </Button>
          </CardFooter>
        </Card>
      </motion.div >
    );
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50 p-4 lg:p-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header - simplified */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              My Bookings
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your tickets and upcoming shows
            </p>
          </div>

          {/* Refresh Button - integrated into header */}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-500 hover:text-blue-500"
            onClick={fetchBookings}
            disabled={refreshing}
          >
            <motion.div
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ repeat: refreshing ? Infinity : 0, duration: 1 }}
            >
              <RefreshCcwIcon className="w-4 h-4 mr-1" />
            </motion.div>
            Refresh
          </Button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState key="loading" />
          ) : bookings.length > 0 ? (
            <motion.div
              key="bookings-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {bookings.map(booking => (
                <TicketCard
                  key={booking.bookingId}
                  booking={booking}
                  isActive={activeBooking === booking.bookingId}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MyBookings;