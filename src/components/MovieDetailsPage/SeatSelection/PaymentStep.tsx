import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CreditCard, X } from "lucide-react";
import { motion } from "framer-motion";
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
  processPayment,
  isProcessing,
  error,
}) => {
  const [discount, setDiscount] = useState<number>(0); // State to store the discount amount
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null); // State to track the applied coupon


  // Define coupons data
  const availableCoupons = [
    { code: "WISSEN12", discount: 150, minAmount: 500 },
    { code: "HUSTLERS3", discount: 80, minAmount: 400 },
    { code: "MANN123", discount: 50, minAmount: 200 }
  ];

  // Function to handle coupon application
  const applyCoupon = (couponCode: string) => {
    if (appliedCoupon === couponCode) {
      alert("This coupon is already applied!");
      return;
    }

    const coupon = availableCoupons.find(c => c.code === couponCode);

    if (coupon && grandTotal >= coupon.minAmount) {
      setDiscount(coupon.discount);
      setAppliedCoupon(couponCode);
    }
  };

  // Function to check if a coupon is valid
  const isCouponValid = (couponCode: string): boolean => {
    const coupon = availableCoupons.find(c => c.code === couponCode);
    return coupon ? grandTotal >= coupon.minAmount : false;
  };
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
            <DialogTitle className="text-lg">Payment</DialogTitle>
            <p className="text-sm text-zinc-500 mt-1">Complete your booking</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setStep("seats")}>
            {/* <X className="h-4 w-4" /> */}
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
                  <span className="text-sm">{cinema?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {showtime ? `${showtime.time} ` : "N/A"}
                  </span>
                  <span className="text-sm">
                    {selectedSeats.length} {selectedSeats.length === 1 ? "Ticket" : "Tickets"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Seats</span>
                  <span className="text-sm">
                    {selectedSeats.map((seat) => (seat.seatRow || "") + seat.seatNumber).join(", ")}
                  </span>
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

                <div className="flex justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Booking Amount</span>
                  <span className="text-sm">₹{grandTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Convenience Fee</span>
                  <span className="text-sm">₹{convenienceFee}</span>
                </div>

                <Separator className="my-2" />

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span>₹{grandTotal + convenienceFee - discount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/*
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Apply Coupon</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex flex-col gap-3">
                {["WISSEN12", "HUSTLERS3", "MANN123"].map((coupon) => (
                  <Button
                    key={coupon}
                    onClick={() => isCouponValid(coupon) && applyCoupon(coupon)}
                    disabled={!isCouponValid(coupon)}
                    className={`w-full ${appliedCoupon === coupon
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : !isCouponValid(coupon)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-gray-200 text-black"
                      }`}
                  >
                    {coupon}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Apply Coupon</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex flex-col gap-3">
                {[
                  {
                    code: "WISSEN12",
                    discount: 150,
                    minAmount: 500,
                    description: "Get ₹150 off on orders above ₹500"
                  },
                  {
                    code: "HUSTLERS3",
                    discount: 80,
                    minAmount: 400,
                    description: "Get ₹80 off on orders above ₹400"
                  },
                  {
                    code: "MANN123",
                    discount: 50,
                    minAmount: 200,
                    description: "Get ₹50 off on orders above ₹200"
                  }
                ].map((couponData) => (
                  <div key={couponData.code} className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{couponData.code}</span>
                      <Button
                        onClick={() => isCouponValid(couponData.code) && applyCoupon(couponData.code)}
                        disabled={!isCouponValid(couponData.code)}
                        className={`${appliedCoupon === couponData.code
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : !isCouponValid(couponData.code)
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gray-100 hover:bg-gray-200 text-black"
                          }`}
                        size="sm"
                      >
                        {appliedCoupon === couponData.code ? "Applied" : "Apply"}
                      </Button>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {couponData.description}
                    </p>
                    {!isCouponValid(couponData.code) && grandTotal < couponData.minAmount && (
                      <p className="text-xs text-red-500 mt-1">
                        Add ₹{couponData.minAmount - grandTotal} more to use this coupon
                      </p>
                    )}
                  </div>
                ))}
              </div>
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
            <p className="font-medium">Total: ₹{grandTotal + convenienceFee - discount}</p>
            <p className="text-sm text-zinc-500">Including all taxes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("seats")}>
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
                  <CreditCard className="mr-2 h-4 w-4" /> Pay ₹{grandTotal + convenienceFee - discount}
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