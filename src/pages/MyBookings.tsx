import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, Calendar, MapPin, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Types for our data model
type BookingStatus = "upcoming" | "completed" | "cancelled";

interface Movie {
  id: string;
  title: string;
  poster: string;
  genre: string[];
  duration: number; // in minutes
  rating: number;
}

interface Theater {
  id: string;
  name: string;
  location: string;
  screen: string;
}

interface Seat {
  row: string;
  number: number;
}

interface Booking {
  id: string;
  movieId: string;
  movie: Movie;
  theaterId: string;
  theater: Theater;
  showDate: Date;
  showTime: string;
  seats: Seat[];
  totalAmount: number;
  status: BookingStatus;
  bookingDate: Date;
  bookingCode: string;
}

// Dummy data
const dummyBookings: Booking[] = [
  {
    id: "bk-001",
    movieId: "mv-001",
    movie: {
      id: "mv-001",
      title: "Dune: Part Two",
      poster: "/api/placeholder/190/250",
      genre: ["Sci-Fi", "Adventure"],
      duration: 166,
      rating: 8.6
    },
    theaterId: "th-001",
    theater: {
      id: "th-001",
      name: "CineWorld",
      location: "Downtown Center",
      screen: "IMAX Screen 1"
    },
    showDate: new Date(2025, 2, 26), // March 26, 2025
    showTime: "19:30",
    seats: [
      { row: "G", number: 12 },
      { row: "G", number: 13 }
    ],
    totalAmount: 32.99,
    status: "upcoming",
    bookingDate: new Date(2025, 2, 24), // March 24, 2025
    bookingCode: "MMBK7209"
  },
  {
    id: "bk-002",
    movieId: "mv-002",
    movie: {
      id: "mv-002",
      title: "The Batman: Falcone's Revenge",
      poster: "/api/placeholder/190/250",
      genre: ["Action", "Crime", "Drama"],
      duration: 152,
      rating: 8.2
    },
    theaterId: "th-002",
    theater: {
      id: "th-002",
      name: "AMC Theatres",
      location: "Westside Mall",
      screen: "Dolby Cinema"
    },
    showDate: new Date(2025, 3, 2), // April 2, 2025
    showTime: "20:15",
    seats: [
      { row: "D", number: 5 },
      { row: "D", number: 6 },
      { row: "D", number: 7 }
    ],
    totalAmount: 46.50,
    status: "upcoming",
    bookingDate: new Date(2025, 2, 23), // March 23, 2025
    bookingCode: "MMBK8105"
  },
  {
    id: "bk-003",
    movieId: "mv-003",
    movie: {
      id: "mv-003",
      title: "Interstellar: Revisited",
      poster: "/api/placeholder/190/250",
      genre: ["Sci-Fi", "Drama"],
      duration: 169,
      rating: 8.8
    },
    theaterId: "th-001",
    theater: {
      id: "th-001",
      name: "CineWorld",
      location: "Downtown Center",
      screen: "IMAX Screen 2"
    },
    showDate: new Date(2025, 2, 15), // March 15, 2025
    showTime: "14:30",
    seats: [
      { row: "J", number: 10 },
      { row: "J", number: 11 }
    ],
    totalAmount: 29.99,
    status: "completed",
    bookingDate: new Date(2025, 2, 10), // March 10, 2025
    bookingCode: "MMBK4562"
  },
  {
    id: "bk-004",
    movieId: "mv-004",
    movie: {
      id: "mv-004",
      title: "Avengers: Secret Wars",
      poster: "/api/placeholder/190/250",
      genre: ["Action", "Adventure", "Fantasy"],
      duration: 178,
      rating: 8.5
    },
    theaterId: "th-003",
    theater: {
      id: "th-003",
      name: "Regal Cinemas",
      location: "Eastpoint Center",
      screen: "RPX Screen"
    },
    showDate: new Date(2025, 1, 28), // February 28, 2025
    showTime: "19:00",
    seats: [
      { row: "F", number: 8 },
      { row: "F", number: 9 }
    ],
    totalAmount: 34.50,
    status: "cancelled",
    bookingDate: new Date(2025, 1, 20), // February 20, 2025
    bookingCode: "MMBK3325"
  }
];

const MyBookings: React.FC = () => {
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter bookings by status
  const upcomingBookings = dummyBookings.filter(booking => booking.status === "upcoming");
  const completedBookings = dummyBookings.filter(booking => booking.status === "completed");
  const cancelledBookings = dummyBookings.filter(booking => booking.status === "cancelled");

  const formatSeats = (seats: Seat[]): string => {
    return seats.map(seat => `${seat.row}${seat.number}`).join(", ");
  };

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would call an API to cancel the booking
    console.log(`Cancelling booking: ${bookingId}`);
    setIsDialogOpen(false);
  };

  const openCancelDialog = (booking: Booking) => {
    setActiveBooking(booking);
    setIsDialogOpen(true);
  };

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

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  // Render a booking card
  const renderBookingCard = (booking: Booking) => (
    <motion.div
      key={booking.id}
      variants={itemVariants}
      layout
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="w-full"
    >
      <Card className="overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <CardTitle className="text-lg mb-1 line-clamp-1">
                {booking.movie.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {format(booking.showDate, "EEE, MMM d, yyyy")} • {booking.showTime}
              </CardDescription>
            </div>
            <StatusBadge status={booking.status} />
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-[90px] h-[120px] overflow-hidden rounded-md">
              <motion.img 
                src={booking.movie.poster} 
                alt={booking.movie.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex flex-col justify-between flex-1">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{booking.theater.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.theater.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Ticket className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{booking.theater.screen}</p>
                    <p className="text-sm text-muted-foreground">Seats: {formatSeats(booking.seats)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">Booking ID: <span className="text-muted-foreground">{booking.bookingCode}</span></p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-0">
          <div className="text-sm">
            <span className="font-medium">${booking.totalAmount.toFixed(2)}</span> • {booking.seats.length} {booking.seats.length === 1 ? "ticket" : "tickets"}
          </div>
          <div className="flex gap-2">
            {booking.status === "upcoming" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openCancelDialog(booking)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => window.alert("Viewing ticket details...")}
                >
                  View Ticket
                </Button>
              </>
            )}
            {booking.status === "completed" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.alert("Viewing ticket details...")}
              >
                View Details
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );

  // Component for status badge
  const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  // Empty state component with animation
  const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="mb-4 rounded-full bg-muted/30 p-6">
        <Ticket className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No bookings found</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
      <Button 
        variant="outline"
        onClick={() => window.location.href = "/movies"}
      >
        Browse Movies
      </Button>
    </motion.div>
  );

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
      
      <Tabs defaultValue="upcoming" className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {upcomingBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {upcomingBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </motion.div>
        
        <TabsContent value="upcoming" className="mt-0">
          <AnimatePresence mode="wait">
            {upcomingBookings.length > 0 ? (
              <motion.div
                key="upcoming-list"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-4"
              >
                {upcomingBookings.map(booking => renderBookingCard(booking))}
              </motion.div>
            ) : (
              <EmptyState message="You don't have any upcoming movie bookings. Browse our latest movies and book your next cinema experience!" />
            )}
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <AnimatePresence mode="wait">
            {completedBookings.length > 0 ? (
              <motion.div
                key="completed-list"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-4"
              >
                {completedBookings.map(booking => renderBookingCard(booking))}
              </motion.div>
            ) : (
              <EmptyState message="You haven't completed any bookings yet. Browse our movies and start your cinema journey!" />
            )}
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-0">
          <AnimatePresence mode="wait">
            {cancelledBookings.length > 0 ? (
              <motion.div
                key="cancelled-list"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-4"
              >
                {cancelledBookings.map(booking => renderBookingCard(booking))}
              </motion.div>
            ) : (
              <EmptyState message="You don't have any cancelled bookings. That's great!" />
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
      
      {/* Cancel Booking Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your booking for {activeBooking?.movie.title}?
              {activeBooking && (
                <div className="mt-2 p-3 bg-muted/40 rounded-md">
                  <p className="font-medium">{format(activeBooking.showDate, "EEEE, MMMM d, yyyy")} • {activeBooking.showTime}</p>
                  <p className="text-sm text-muted-foreground">{activeBooking.theater.name} • {formatSeats(activeBooking.seats)} {activeBooking.seats.length > 1 ? "seats" : "seat"}</p>
                </div>
              )}
              <p className="mt-2">You may be eligible for a refund according to our cancellation policy.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => activeBooking && handleCancelBooking(activeBooking.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyBookings;