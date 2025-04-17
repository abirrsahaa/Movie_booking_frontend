import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Seat, SeatMapProps } from "@/interfaces/interfaces_All";
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, X } from "lucide-react";

const SeatMap: React.FC<SeatMapProps> = ({
  movie,
  cinema,
  showtime,
  seatMap,
  selectedSeats,
  toggleSeat,
  prices,
  onClose,
  grandTotal,
  setStep,
}) => {
  return (
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
            <DialogTitle className="text-lg">{movie.title}</DialogTitle>
            <p className="text-sm text-zinc-500 mt-1">
              {cinema && showtime ? `${cinema.name} • ${showtime.time} ` : 'N/A'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            {/* <ChevronLeft className="h-4 w-4" /> */}
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
                          {seat.seatNumber === 1 && <div className="w-6"></div>}
                          {(seat.seatNumber === 5 || seat.seatNumber === 13) && <div className="w-6"></div>}
                          <button
                            className={`w-6 h-6 rounded-t-md text-xs flex items-center justify-center transition-colors ${
                              !seat.seatAvailable
                                ? 'bg-red-200 text-red-800 cursor-not-allowed dark:bg-red-900/30 dark:text-red-400' 
                                : selectedSeats.some(s => s.id === seat.id)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                            }`}
                            onClick={() => toggleSeat(seat, section, row)}
                            disabled={!seat.seatAvailable}
                          >
                            {seat.seatNumber}
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
              {selectedSeats.map(seat => (seat.seatRow || '') + seat.seatNumber).join(', ')}
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
  );
};

export default SeatMap;