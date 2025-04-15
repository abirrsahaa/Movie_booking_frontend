import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, User, ArrowUpRight, Flame, Shield } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Auction } from "@/types";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "./CountDownTimer";

interface AuctionCardProps {
    auction: Auction;
    index?: number;
}

const AuctionCard = ({ auction, index = 0 }: AuctionCardProps) => {
    const navigate = useNavigate();
    const [isExpired, setIsExpired] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [bidAnimation, setBidAnimation] = useState(false);
    const [prevBid, setPrevBid] = useState(auction.currentBid);

    // Detect changes in current bid for animation
    useEffect(() => {
        if (prevBid !== undefined && auction.currentBid !== undefined && prevBid !== auction.currentBid) {
            setBidAnimation(true);
            const timer = setTimeout(() => setBidAnimation(false), 2000);
            return () => clearTimeout(timer);
        }
        setPrevBid(auction.currentBid);
    }, [auction.currentBid, prevBid]);

    const handleJoinAuction = () => {
        navigate(`/main/auction/${auction.id}`);
    };

    const handleViewDetails = () => {
        navigate(`/main/auction/${auction.id}`);
    };

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
            }
        },
        hover: {
            y: -8,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
            transition: { duration: 0.3 }
        }
    };

    const imageVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.4 }
        }
    };

    const bidFlashVariants = {
        inactive: { opacity: 0 },
        active: {
            opacity: [0, 1, 0],
            transition: { duration: 2, times: [0, 0.2, 1] }
        }
    };

    // Format the movie title to handle long titles
    const formatTitle = (title: string | undefined) => {
        if (!title) return "";
        return title.length > 25 ? `${title.substring(0, 25)}...` : title;
    };

    // Check if auction is ending soon (less than 3 minutes)
    const isEndingSoon = () => {
        if (!auction.endTime) return false;
        const endTime = new Date(auction.endTime).getTime();
        const now = new Date().getTime();
        const timeLeft = endTime - now;
        return timeLeft > 0 && timeLeft < 3 * 60 * 1000; // Less than 3 minutes
    };

    // Check if this is the highest bid yet
    const isHighBid = () => {
        return auction.currentBid && auction.basePrice && auction.currentBid >= auction.basePrice * 1.5;
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="w-full h-full"
            layoutId={`auction-card-${auction.id}`}
        >
            <Card className="overflow-hidden h-full flex flex-col border-0 bg-white shadow-md rounded-xl">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                    <motion.div
                        variants={imageVariants}
                        className="w-full h-56 bg-gray-100"
                    >
                        <img
                            src={auction.imageUrl || "/api/placeholder/400/600"}
                            alt={auction.movieTitle}
                            className="object-cover w-full h-full"
                        />

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                        {/* Badge indicators */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            {isEndingSoon() && (
                                <Badge className="bg-red-500 text-white border-none">
                                    <Flame className="w-3 h-3 mr-1" />
                                    Ending Soon
                                </Badge>
                            )}
                            {isHighBid() && (
                                <Badge className="bg-amber-500 text-white border-none">
                                    Hot Deal
                                </Badge>
                            )}
                        </div>

                        {/* Time indicator */}
                        <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="bg-black/70 text-white border-none font-medium">
                                {auction.showtime}
                            </Badge>
                        </div>

                        {/* Bottom positioned movie title */}
                        <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="font-semibold text-xl text-white drop-shadow-md">
                                {formatTitle(auction.movieTitle)}
                            </h3>
                            <div className="flex items-center text-white/90 text-sm mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {auction.theater}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Card Content */}
                <CardContent className="flex-grow flex flex-col pt-4 pb-2">
                    {/* Countdown Timer */}
                    <div className="mb-3">
                        <CountdownTimer
                            endTime={auction.endTime}
                            onExpire={() => setIsExpired(true)}
                            className="w-full"
                        />
                    </div>

                    <div className="flex-grow space-y-2 text-sm">
                        {/* Seat Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Shield className="h-4 w-4 mr-1 text-slate-500" />
                                <span className="text-slate-600">Seat:</span>
                            </div>
                            <span className="font-medium">{auction.seat}</span>
                        </div>

                        {/* Seller Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-1 text-slate-500" />
                                <span className="text-slate-600">Seller:</span>
                            </div>
                            <span className="font-medium">{auction.sellerName}</span>
                        </div>

                        {/* Bid Info - With animation */}
                        <div className="relative mt-3 py-2">
                            <motion.div
                                variants={bidFlashVariants}
                                animate={bidAnimation ? "active" : "inactive"}
                                className="absolute inset-0 bg-green-100 rounded-md"
                            />
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-slate-500" />
                                    <span className="text-slate-600">Current bid:</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-primary">
                                        ₹{auction.currentBid || auction.basePrice}
                                    </span>
                                    <div className="text-xs text-slate-500">
                                        Base: ₹{auction.basePrice}
                                    </div>
                                </div>
                            </div>

                            {auction.highestBidder && (
                                <div className="text-xs text-slate-500 mt-1 text-right">
                                    Highest bidder: <span className="font-medium">{auction.highestBidder}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-0 pb-4 flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-[40%] border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        onClick={handleViewDetails}
                    >
                        Details
                        <AnimatePresence>
                            {isHovered && (
                                <motion.span
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ArrowUpRight className="ml-1 h-3 w-3" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        className="w-[60%] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
                        onClick={handleJoinAuction}
                        disabled={isExpired}
                    >
                        {isExpired ? "Auction Ended" : "Bid Now"}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default AuctionCard;