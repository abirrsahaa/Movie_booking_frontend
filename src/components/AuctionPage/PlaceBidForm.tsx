import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Auction } from "@/types";
import { toast } from "sonner";

interface PlaceBidFormProps {
    auction: Auction;
    onPlaceBid: (amount: number) => void;
}

const PlaceBidForm = ({ auction, onPlaceBid }: PlaceBidFormProps) => {
    const [bidAmount, setBidAmount] = useState<number>(
        auction.currentBid ? auction.currentBid + 10 : auction.basePrice || 0
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const minBidAmount = (auction.currentBid ?? 0) + 10;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (bidAmount < minBidAmount) {
            toast.error(`Bid must be at least ₹${minBidAmount}`);
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            onPlaceBid(bidAmount);
            setIsSubmitting(false);
            toast.success("Your bid has been placed!");
            // Set next bid amount to current + 10
            setBidAmount(bidAmount + 10);
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Current bid:</span>
                    <span className="font-medium">₹{auction.currentBid || "No bids yet"}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted-foreground">Minimum bid:</span>
                    <span className="font-medium">₹{minBidAmount}</span>
                </div>

                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        ₹
                    </span>
                    <Input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        min={minBidAmount}
                        step={10}
                        className="pl-7"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setBidAmount(minBidAmount)}
                >
                    Min (₹{minBidAmount})
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setBidAmount(minBidAmount + 50)}
                >
                    +₹50
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setBidAmount(minBidAmount + 100)}
                >
                    +₹100
                </Button>
            </div>

            <motion.div
                whileTap={{ scale: 0.98 }}
            >
                <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isSubmitting || bidAmount < minBidAmount}
                >
                    {isSubmitting ? "Placing Bid..." : "Place Bid"}
                </Button>
            </motion.div>

            <p className="text-xs text-muted-foreground text-center">
                By placing a bid, you agree to purchase the ticket if you win.
            </p>
        </form>
    );
};

export default PlaceBidForm;