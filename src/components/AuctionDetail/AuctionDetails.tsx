import { memo } from "react";
import { motion } from "framer-motion";
import CurrentBidDisplay from "./CurrentBidDisplay";
import CountdownTimer from "../AuctionPage/CountDownTimer";
import { CalendarClock, MapPin, Ticket, User } from "lucide-react";
import { Separator } from "@radix-ui/react-select";


const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};


const AuctionDetails = memo(({ auction, onAuctionEnd }) => (
    <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <CurrentBidDisplay
                currentBid={auction.currentBid}
                highestBidder={auction.highestBidder}
            />
            <div className="bg-muted/50 p-3 rounded-lg">
                <CountdownTimer
                    endTime={auction.endTime}
                    onExpire={onAuctionEnd}
                    className="text-foreground font-medium"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <motion.div variants={fadeInVariants} className="flex items-center">
                <CalendarClock className="h-5 w-5 mr-3 text-blue-500" />
                <div>
                    <span className="block text-xs text-muted-foreground">Showtime</span>
                    <span className="font-medium">{auction.showtime}</span>
                </div>
            </motion.div>

            <motion.div variants={fadeInVariants} className="flex items-center">
                <Ticket className="h-5 w-5 mr-3 text-green-500" />
                <div>
                    <span className="block text-xs text-muted-foreground">Base Price</span>
                    <span className="font-medium">₹{auction.basePrice}</span>
                </div>
            </motion.div>

            <motion.div variants={fadeInVariants} className="flex items-center">
                <User className="h-5 w-5 mr-3 text-purple-500" />
                <div>
                    <span className="block text-xs text-muted-foreground">Seller</span>
                    <span className="font-medium">{auction.sellerName}</span>
                </div>
            </motion.div>

            <motion.div variants={fadeInVariants} className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-red-500" />
                <div>
                    <span className="block text-xs text-muted-foreground">Location</span>
                    <span className="font-medium">Within 1km of the theater</span>
                </div>
            </motion.div>
        </div>

        <Separator className="my-6" />

        <motion.div variants={fadeInVariants}>
            <h2 className="text-xl font-semibold mb-3">About This Ticket</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{auction.description}</p>

            <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
                <h3 className="font-medium mb-2">Important Information</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start">
                        <span className="inline-block w-1 h-1 rounded-full bg-primary mt-2 mr-2"></span>
                        This auction will end in exactly 10 minutes.
                    </li>
                    <li className="flex items-start">
                        <span className="inline-block w-1 h-1 rounded-full bg-primary mt-2 mr-2"></span>
                        You must be within 1km of the theater to participate.
                    </li>
                    <li className="flex items-start">
                        <span className="inline-block w-1 h-1 rounded-full bg-primary mt-2 mr-2"></span>
                        Winning bidders must meet the seller to complete the transaction.
                    </li>
                    <li className="flex items-start">
                        <span className="inline-block w-1 h-1 rounded-full bg-primary mt-2 mr-2"></span>
                        The seller is responsible for transferring the ticket securely.
                    </li>
                </ul>
            </div>
        </motion.div>
    </div>
));
export default AuctionDetails;