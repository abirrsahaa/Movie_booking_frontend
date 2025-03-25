import { Seat, SeatSelectionProps } from "@/interfaces/interfaces_All";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { AlertCircle, Check, CreditCard, Wallet, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";




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
  
      const aesehi=async ()=>{
        const getting=await axios.get("http://localhost:9090/hello");
        console.log(getting.data);
      }
      aesehi();
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

  export default SeatSelectionComponent;