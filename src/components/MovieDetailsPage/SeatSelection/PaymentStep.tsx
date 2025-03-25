import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CreditCard, Wallet, X } from "lucide-react";
import {motion} from "framer-motion";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { prices } from "@/constants/FixedData";
import { PaymentStepProps } from "@/interfaces/interfaces_All";




const PaymentStep: React.FC<PaymentStepProps> = ({
  movie,
  cinema,
  showtime,
  selectedSeats,
  setStep,
  convenienceFee,
  grandTotal,
  paymentMethod,
  setPaymentMethod,
  processPayment,
  isProcessing,
  error

}) => {
  return (
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
  );
};

export default PaymentStep;