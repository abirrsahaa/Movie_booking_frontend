import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { ConfirmationStepProps } from "@/interfaces/interfaces_All";



const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  movie,
  cinema,
  showtime,
  selectedSeats,
  grandTotal,
  onClose,
}) => {
  return (
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
              <span>{selectedSeats.map((seat) => (seat.seatRow || "") + seat.seatNumber).join(", ")}</span>
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
  );
};

export default ConfirmationStep;