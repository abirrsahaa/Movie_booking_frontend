import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, X, CreditCard, Wallet, Star, Clock, Film, Calendar, MapPin, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export interface Movie {
    title: string;
    rating: string;
    score: string;
    description: string;
    genres: string[];
    duration: string;
    ageRating: string;
    language: string;
    director: string;
    cast: string[];
    poster: string;
    banner: string;
  }
  
  export interface Showtime {
    time: string;
    type: string;
    price: number;
  }
  
  export interface Cinema {
    name: string;
    location: string;
    distance: string;
    showtimes: Showtime[];
    available: boolean;
  }
  
  export interface Review {
    name: string;
    publication: string;
    rating: number;
    text: string;
  }
  
  export interface Offer {
    title: string;
    code: string;
    description: string;
    expiry: string;
  }
  
  export interface Seat {
    id: string;
    number: number;
    status: 'available' | 'sold';
    row?: string;
    section?: string;
    price?: number;
  }
  
  export interface SeatSelectionProps {
    movie: Movie;
    cinema: Cinema | null;
    showtime: Showtime | null;
    onClose: () => void;
    open: boolean;
  }
  
  export interface MovieDetailsPageProps {
    movie: Movie;
    dates: { day: string; date: string; month: string }[];
    cinemas: Cinema[];
    reviews: Review[];
    offers: Offer[];
  }
// Seat selection component that opens after selecting a showtime
const SeatSelectionComponent: React.FC<SeatSelectionProps> = ({ 
  movie, 
  cinema, 
  showtime, 
  onClose, 
  open 
}) => {
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [seatMap, setSeatMap] = useState<Record<string, Record<string, Seat[]>>>({});
    const [step, setStep] = useState<'seats' | 'payment' | 'confirmation'>('seats');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
  // Mock seat data
  useEffect(() => {
    if (open) {
      const generateSeats = () => {
        const sections = ['Premium', 'Executive', 'Standard'];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        
        const seatData: Record<string, Record<string, Seat[]>> = {};
        
        sections.forEach(section => {
          seatData[section] = {};
          
          // Different rows per section
          const sectionRows = section === 'Premium' ? rows.slice(0, 3) : 
                             section === 'Executive' ? rows.slice(3, 7) : 
                             rows.slice(7, 10);
          
          sectionRows.forEach(row => {
            seatData[section][row] = [];
            
            // Generate seats for each row with some random unavailable seats
            for (let i = 1; i <= 18; i++) {
              // Create a gap in the middle
              if (i === 9 || i === 10) continue;
              
              // Random unavailable seats (around 15%)
              const unavailable = Math.random() < 0.15;
              
              seatData[section][row].push({
                id: `${row}${i}`,
                number: i,
                status: unavailable ? 'sold' : 'available'
              });
            }
          });
        });
        
        return seatData;
      };
      
      setSeatMap(generateSeats());
    }
  }, [open]);

  const prices: Record<string, number> = {
    'Premium': 250,
    'Executive': 200,
    'Standard': 180
  };

  // Handle seat selection
  const toggleSeat = (seat: Seat, section: string, row: string) => {
    if (seat.status === 'sold') return;
    
    const seatId = `${section}-${row}-${seat.id}`;
    
    if (selectedSeats.some(s => s.id === seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, { 
        id: seatId, 
        number: parseInt(seat.id, 10), 
        row, 
        section,
        price: prices[section],
        status: 'available' // Assuming the seat is available when selected
      }]);
    }
  };

  // Process payment
  const processPayment = () => {
    setIsProcessing(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Random success (90% chance)
      if (Math.random() < 0.9) {
        setStep('confirmation');
      } else {
        setError('Payment failed. Please try again.');
      }
    }, 1500);
  };

  // Calculate total amount
  const totalAmount = selectedSeats.reduce((sum, seat) => sum + (seat.price ?? 0), 0);
  
  // Convenience fee
  const convenienceFee = Math.round(totalAmount * 0.05);
  
  // Grand total
  const grandTotal = totalAmount + convenienceFee;

  return (
    <Dialog open={open} onOpenChange={() => step === 'seats' && onClose()}>
      <DialogContent className="max-w-4xl max-h-screen overflow-auto p-0">
        <AnimatePresence mode="wait">
          {step === 'seats' && (
            <motion.div
              key="seats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-xl">{movie.title}</DialogTitle>
                    <p className="text-sm text-zinc-500 mt-1">
                      {cinema && showtime ? `${cinema.name} • ${showtime.time} • ${showtime.type}` : 'N/A'}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="p-6">
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-8 mb-6 rounded-full flex items-center justify-center text-sm text-zinc-600 dark:text-zinc-400">
                  Screen
                </div>
                
                <div className="space-y-8">
                  {Object.keys(seatMap).map(section => (
                    <div key={section} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">{section}</h3>
                        <span className="text-sm font-medium">₹{prices[section]}</span>
                      </div>
                      <div className="space-y-1">
                        {Object.keys(seatMap[section]).map(row => (
                          <div key={row} className="flex items-center">
                            <span className="text-xs w-6 text-zinc-500">{row}</span>
                            <div className="flex flex-1 justify-center gap-1">
                              {seatMap[section][row].map((seat, i) => (
                                <React.Fragment key={seat.id}>
                                  {seat.number === 1 && <div className="w-6"></div>}
                                  {(seat.number === 5 || seat.number === 13) && <div className="w-6"></div>}
                                  <button
                                    className={`w-6 h-6 rounded-t-md text-xs flex items-center justify-center transition-colors ${
                                      seat.status === 'sold' 
                                        ? 'bg-red-200 text-red-800 cursor-not-allowed dark:bg-red-900/30 dark:text-red-400' 
                                        : selectedSeats.some(s => s.id === `${section}-${row}-${seat.id}`)
                                          ? 'bg-blue-500 text-white'
                                          : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                                    }`}
                                    onClick={() => toggleSeat(seat, section, row)}
                                    disabled={seat.status === 'sold'}
                                  >
                                    {seat.number}
                                  </button>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-green-100 dark:bg-green-900/20"></div>
                      <span className="text-xs">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-blue-500"></div>
                      <span className="text-xs">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-red-200 dark:bg-red-900/30"></div>
                      <span className="text-xs">Sold</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardFooter className="bg-zinc-50 dark:bg-zinc-900 p-6 border-t">
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="font-medium">
                      {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'} Selected
                    </p>
                    <p className="text-sm text-zinc-500">
                      {selectedSeats.map(seat => (seat.row || '') + seat.number).join(', ')}
                    </p>
                  </div>
                  <Button 
                    onClick={() => selectedSeats.length > 0 && setStep('payment')}
                    disabled={selectedSeats.length === 0}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Pay ₹{grandTotal}
                  </Button>
                </div>
              </CardFooter>
            </motion.div>
          )}
          
          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-xl">Payment</DialogTitle>
                    <p className="text-sm text-zinc-500 mt-1">
                      Complete your booking
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setStep('seats')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="p-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">{movie.title}</span>
                          <span className="text-sm">{cinema?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {showtime ? `${showtime.time} • ${showtime.type}` : 'N/A'}
                          </span>
                          <span className="text-sm">{selectedSeats.length} {selectedSeats.length === 1 ? 'Ticket' : 'Tickets'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">Seats</span>
                          <span className="text-sm">{selectedSeats.map(seat => (seat.row || '') + seat.number).join(', ')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base">Price Details</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="space-y-3">
                        {Object.keys(prices).map(section => {
                          const sectionSeats = selectedSeats.filter(seat => seat.section === section);
                          if (sectionSeats.length === 0) return null;
                          
                          return (
                            <div key={section} className="flex justify-between">
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                {section} ({sectionSeats.length} {sectionSeats.length === 1 ? 'Ticket' : 'Tickets'})
                              </span>
                              <span className="text-sm">₹{sectionSeats.length * prices[section]}</span>
                            </div>
                          );
                        })}
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">Convenience Fee</span>
                          <span className="text-sm">₹{convenienceFee}</span>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="flex justify-between font-medium">
                          <span>Total Amount</span>
                          <span>₹{grandTotal}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base">Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "card" | "wallet")}>
                        <TabsList className="grid grid-cols-2 mb-4">
                          <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
                          <TabsTrigger value="wallet">Digital Wallet</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="card" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <label className="text-sm font-medium block mb-1">Card Number</label>
                              <input 
                                type="text" 
                                placeholder="1234 5678 9012 3456"
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium block mb-1">Expiry Date</label>
                              <input 
                                type="text" 
                                placeholder="MM/YY"
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium block mb-1">CVV</label>
                              <input 
                                type="text" 
                                placeholder="123"
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-sm font-medium block mb-1">Name on Card</label>
                              <input 
                                type="text" 
                                placeholder="John Doe"
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="wallet" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="border rounded-md p-3 flex items-center gap-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">PayTM</p>
                              </div>
                            </div>
                            <div className="border rounded-md p-3 flex items-center gap-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">PhonePe</p>
                              </div>
                            </div>
                            <div className="border rounded-md p-3 flex items-center gap-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">GPay</p>
                              </div>
                            </div>
                            <div className="border rounded-md p-3 flex items-center gap-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-red-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">AmazonPay</p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Payment Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              
              <CardFooter className="bg-zinc-50 dark:bg-zinc-900 p-6 border-t">
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="font-medium">Total: ₹{grandTotal}</p>
                    <p className="text-sm text-zinc-500">Including all taxes</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep('seats')}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={processPayment}
                      disabled={isProcessing}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" /> Pay ₹{grandTotal}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </motion.div>
          )}
          
          {step === 'confirmation' && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-6 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Your tickets have been booked successfully</p>
              
              <Card className="w-full max-w-md mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Movie</span>
                      <span className="font-medium">{movie.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Cinema</span>
                      <span>{cinema?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Date & Time</span>
                      <span>{showtime ? `${showtime.time}, Today` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Seats</span>
                      <span>{selectedSeats.map(seat => (seat.row || '') + seat.number).join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Amount Paid</span>
                      <span className="font-medium">₹{grandTotal}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-400">Booking ID</span>
                        <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
                          INOX{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <p className="text-sm text-zinc-500 mb-6">
                A confirmation has been sent to your email and mobile number
              </p>
              
              <Button 
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700"
              >
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced MovieDetailsPage with seat selection functionality
const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({ movie, dates, cinemas, reviews, offers }) => {
    const [selectedDate, setSelectedDate] = useState(
        `${dates[0].day} ${dates[0].date} ${dates[0].month}`
      );
      const [seatSelectionOpen, setSeatSelectionOpen] = useState(false);
      const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
      const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Handle showtime selection
  const handleShowtimeClick = (cinema: Cinema, showtime: Showtime) => {
    setSelectedCinema(cinema);
    setSelectedShowtime(showtime);
    setSeatSelectionOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Hero Section with Parallax Banner */}
      <motion.div
        className="relative w-full h-96 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10"
          whileHover={{ opacity: 0.7 }}
        />
        <motion.img
          src={movie.banner}
          alt={movie.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10 }}
        />

        <div className="absolute bottom-0 left-0 z-20 w-full p-6">
          <div className="container mx-auto flex flex-col md:flex-row items-end gap-6">
            <motion.div
              className="w-32 h-48 bg-zinc-800 rounded-lg overflow-hidden shadow-xl"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
            </motion.div>

            <motion.div className="flex-1 text-white" variants={slideUp}>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-green-600 hover:bg-green-700">{movie.rating}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-sm font-medium">{movie.score}</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>

              <div className="flex flex-wrap gap-2 mb-3">
                {movie.genres.map((genre, i) => (
                  <Badge key={i} variant="outline" className="border-zinc-600">
                    {genre}
                  </Badge>
                ))}
                <Badge variant="outline" className="border-zinc-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {movie.duration}
                </Badge>
                <Badge variant="outline" className="border-zinc-600">{movie.ageRating}</Badge>
                <Badge variant="outline" className="border-zinc-600">{movie.language}</Badge>
              </div>

              <p className="text-zinc-300 max-w-2xl mb-4">{movie.description}</p>

              <div className="flex gap-3">
                <Button className="bg-red-600 hover:bg-red-700">Book Tickets</Button>
                <Button variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800">
                  <Film className="mr-2 h-4 w-4" /> Trailer
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content Tabs */}
      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="showtimes" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="showtimes" className="text-sm md:text-base">Showtimes</TabsTrigger>
            <TabsTrigger value="about" className="text-sm md:text-base">About</TabsTrigger>
            <TabsTrigger value="cast" className="text-sm md:text-base">Cast & Crew</TabsTrigger>
            <TabsTrigger value="reviews" className="text-sm md:text-base">Reviews</TabsTrigger>
            <TabsTrigger value="offers" className="text-sm md:text-base">Offers</TabsTrigger>
          </TabsList>

          {/* Showtimes Tab */}
          <TabsContent value="showtimes" className="space-y-6">
            {/* Date Selection */}
            <div className="flex items-center gap-4 mb-4">
              <Select onValueChange={(value) => setSelectedDate(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Date" />
                  <Calendar className="w-4 h-4 ml-2" />
                </SelectTrigger>
                <SelectContent>
                  {dates.map((date, i) => (
                    <SelectItem key={i} value={`${date.day} ${date.date} ${date.month}`}>
                      {date.day}, {date.date} {date.month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cinemas List */}
            <motion.div
              className="space-y-6"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              {cinemas.map((cinema, i) => (
                <motion.div
                  key={i}
                  variants={slideUp}
                  whileHover={{ y: -2 }}
                  className="rounded-lg overflow-hidden"
                >
                  <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
                    <CardContent className="p-0">
                      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-start gap-2">
                            <h3 className="text-lg font-medium">{cinema.name}</h3>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                            >
                              SAFE
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            {cinema.location} • {cinema.distance}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                          <Info className="w-4 h-4 mr-1" /> Info
                        </Button>
                      </div>
                      <Separator className="my-2" />
                      <div className="p-4 flex flex-wrap gap-2">
                        {cinema.showtimes.map((showtime, j) => (
                          <Button
                            key={j}
                            variant="outline"
                            className="text-sm border-zinc-300 dark:border-zinc-700"
                            onClick={() => handleShowtimeClick(cinema, showtime)}
                          >
                            <ChevronRight className="w-4 h-4 mr-1" />
                            {showtime.time} - {showtime.type} - {showtime.price}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About the Movie</h2>
                <p className="mb-4">{movie.description}</p>
                <p className="mb-4">
                  Directed by <span className="font-medium">{movie.director}</span>.
                </p>
                <h3 className="text-lg font-medium mb-2">Cast</h3>
                <ul className="space-y-2">
                  {movie.cast.map((actor, i) => (
                    <li key={i}>{actor}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cast & Crew Tab */}
          <TabsContent value="cast">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Cast & Crew</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movie.cast.map((actor, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-2">
                        <img
                          src="/api/placeholder/150/200"
                          alt={actor}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium">{actor}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Actor</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{review.name}</h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">{review.publication}</p>
                        </div>
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, j) => (
                              <Star
                                key={j}
                                className={`w-4 h-4 ${
                                  j < review.rating
                                    ? "fill-yellow-400 stroke-yellow-400"
                                    : "stroke-zinc-300 dark:stroke-zinc-600"
                                }`}
                              />
                            ))}
                        </div>
                      </div>
                      <p className="text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Available Offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offers.map((offer, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -2 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium text-lg">{offer.title}</h3>
                        <Badge>{offer.code}</Badge>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 my-2">{offer.description}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">{offer.expiry}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Seat Selection Dialog */}
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