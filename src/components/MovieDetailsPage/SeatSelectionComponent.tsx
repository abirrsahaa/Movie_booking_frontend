import { Seat, SeatSelectionProps } from "@/interfaces/interfaces_All";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { AnimatePresence } from "framer-motion";
import ConfirmationStep from "./SeatSelection/ConfirmationStep";
import PaymentStep from "./SeatSelection/PaymentStep";
import SeatMap from "./SeatSelection/SeatMap";
import { prices } from "@/constants/FixedData";
import { resolve } from "path";
import { useAppSelector } from "@/store/store";


const SeatSelectionComponent: React.FC<SeatSelectionProps> = ({ 
    movie, 
    cinema, 
    showtime, 
    onClose, 
    open 
  }) => {
    const { userData, isAuthenticated, isLoading, errorR } = useAppSelector((state) => state.user);

    console.log(userData);

      const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
      const [seatMap, setSeatMap] = useState<Record<string, Record<string, Seat[]>>>({});
      const [step, setStep] = useState<'seats' | 'payment' | 'confirmation'>('seats');
      const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
      const [isProcessing, setIsProcessing] = useState(false);
      const [error, setError] = useState<string | null>(null);

      const validateSeat = (seat: any): seat is Seat => {
        // Check for required properties and their types
        const requiredProps = [
          'id',
          'seatNumber',
          'seatAvailable',
          'seatRow',
          'section'
        ];
      
        // Check if all required properties exist and have valid types
        const isValid = requiredProps.every(prop => {
          if (!seat.hasOwnProperty(prop)) {
            console.warn(`Missing property: ${prop}`, seat);
            return false;
          }
          return true;
        });
      
        // Additional validation checks
        const typeChecks = [
          typeof seat.id === 'number',
          typeof seat.seatNumber === 'number',
          typeof seat.seatAvailable === 'boolean'
        ];
      
        const passesTypeChecks = typeChecks.every(check => check);
      
        if (!isValid || !passesTypeChecks) {
          console.warn('Invalid seat data:', seat);
          return false;
        }
      
        return true;
      };
    
      // Fetch seats for the specific showtime
      useEffect(() => {
        const fetchSeats = async () => {
          try {
            const showtimeId =  1;
            const response = await axios.get(`http://localhost:9090/showtime/${showtimeId}`);
            const fetchedSeats: any[] = response.data;
      
            console.log('Total fetched seats:', fetchedSeats.length);
      
            // Filter out invalid seats
            const validSeats = fetchedSeats.filter(validateSeat);
      
            console.log('Valid seats:', validSeats.length);
      
            if (validSeats.length === 0) {
              throw new Error('No valid seats found in the seat map');
            }
      
            const seatData: Record<string, Record<string, Seat[]>> = {};
      
            validSeats.forEach((seat: Seat) => {
              // Initialize the section if it doesn't exist
              const section = seat.section || 'default';
              const seatRow = seat.seatRow || 'default';
      
              if (!seatData[section]) {
                seatData[section] = {};
              }
      
              // Initialize the row within the section if it doesn't exist
              if (!seatData[section][seatRow]) {
                seatData[section][seatRow] = [];
              }
      
              // Push the seat into the appropriate section and row
              seatData[section][seatRow].push({
                ...seat,
                price: prices[section] || 0
              });
            });
      
            setSeatMap(seatData);
          } catch (error) {
            console.error("Error fetching seat data:", error);
            setError('Failed to load seat map');
          }
        };
      
        if (open) {
          fetchSeats();
        }
      }, [open, showtime?.id]);
  
    // Handle seat selection
    const toggleSeat = (seat: Seat, section: string, seatRow: string) => {
      if (!seat.seatAvailable) return;
      
      const seatId = `${section}-${seatRow}-${seat.id}`;
      
      // Check if seat is already selected
      const existingSeatIndex = selectedSeats.findIndex(s => 
        s.id === seat.id && 
        s.section === section && 
        s.seatRow === seatRow
      );
      
      if (existingSeatIndex !== -1) {
        // Remove seat if already selected
        setSelectedSeats(selectedSeats.filter((_, index) => index !== existingSeatIndex));
      } else {
        // Add seat if not already selected
        setSelectedSeats([...selectedSeats, { 
          ...seat,
          section,
          seatRow,
          price: prices[section] || 0,
          showtime: showtime
        }]);
      }
    };
  
    // Process payment
    const processPayment = async () => {
      setIsProcessing(true);
      setError(null);
      
      try {
        // Simulate payment processing
        // call the backend api for booking with the seats array 
        const seatIds:number[] = selectedSeats.map(seat => seat.id);


        const response = await axios.post(`http://localhost:9090/bookingMovie/${userData?.id}/${movie.id}`, {
          "seatIds":seatIds
        });
        console.log(response);
       
        // await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Random success (90% chance)
        if (Math.random() < 0.9) {
          // Here you might want to add actual payment processing logic
          setStep('confirmation');
        } else {
          throw new Error('Payment failed');
        }
      } catch (paymentError) {
        setError('Payment failed. Please try again.');
        console.log(paymentError);
      } finally {
        setIsProcessing(false);
      }
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
                setStep={setStep}
              />
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
                onClose={onClose}
              />
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    );
  };

export default SeatSelectionComponent;