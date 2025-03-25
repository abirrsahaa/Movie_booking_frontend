import { Seat, SeatSelectionProps } from "@/interfaces/interfaces_All";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { AnimatePresence } from "framer-motion";
import ConfirmationStep from "./SeatSelection/ConfirmationStep";
import PaymentStep from "./SeatSelection/PaymentStep";
import SeatMap from "./SeatSelection/SeatMap";

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
              <SeatMap 
                movie={movie} 
                cinema={cinema} 
                showtime={showtime} 
                seatMap={seatMap} 
                selectedSeats={selectedSeats} 
                toggleSeat={toggleSeat} 
                prices={prices} 
                onClose={onClose} 
                grandTotal={grandTotal} 
                setStep={setStep}/>
            )}
            {step === 'payment' && (
              <PaymentStep 
                grandTotal={grandTotal} 
                paymentMethod={paymentMethod} 
                setPaymentMethod={setPaymentMethod} 
                processPayment={processPayment} 
                isProcessing={isProcessing} 
                error={error}
                setStep={setStep}
                cinema={cinema}
                showtime={showtime}
                selectedSeats={selectedSeats}
                movie={movie}
                convenienceFee={convenienceFee}
                />
            )}
            {step === 'confirmation' && (
              <ConfirmationStep 
                movie={movie} 
                cinema={cinema} 
                showtime={showtime} 
                selectedSeats={selectedSeats} 
                grandTotal={grandTotal} 
                onClose={onClose}/>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    );
  };

  export default SeatSelectionComponent;