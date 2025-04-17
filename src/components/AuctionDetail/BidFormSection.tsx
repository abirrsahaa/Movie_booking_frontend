import { memo } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Sparkles } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import PlaceBidForm from "../AuctionPage/PlaceBidForm";

const BidFormSection = memo(({ auction, isAuctionEnded, bidSuccess, onPlaceBid, navigate }) => (
    <div className="sticky top-20">
        <AnimatePresence>
            {bidSuccess && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl"
                >
                    <div className="text-center p-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <Sparkles className="h-8 w-8" />
                        </motion.div>
                        <h3 className="text-xl font-bold mb-2">Bid Placed!</h3>
                        <p className="text-muted-foreground">Your bid has been submitted successfully</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <Card className="shadow-lg border-primary/10 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                <h2 className="text-xl font-semibold mb-1">Place Your Bid</h2>
                <p className="text-sm text-muted-foreground">
                    Increase your chances of winning!
                </p>
            </div>

            <div className="p-6">
                {isAuctionEnded ? (
                    <motion.div
                        className="text-center py-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Auction Ended</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            This auction has ended and is no longer accepting bids.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full hover:bg-primary/10 transition-all duration-300"
                            onClick={() => navigate("/auctions")}
                        >
                            Browse Other Auctions
                        </Button>
                    </motion.div>
                ) : (
                    <PlaceBidForm auction={auction} onPlaceBid={onPlaceBid} />
                )}
            </div>

            {!isAuctionEnded && (
                <div className="px-6 pb-6">
                    <div className="mt-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <p className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                            Once submitted, bids cannot be retracted.
                        </p>
                    </div>
                </div>
            )}
        </Card>
    </div>
));

export default BidFormSection;