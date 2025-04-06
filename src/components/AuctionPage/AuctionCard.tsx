import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Auction } from "@/types";

import { useNavigate } from "react-router-dom";
import CountdownTimer from "./CountDownTimer";

interface AuctionCardProps {
    auction: Auction;
}

const AuctionCard = ({ auction }: AuctionCardProps) => {
    const navigate = useNavigate();
    const [isExpired, setIsExpired] = useState(false);

    const handleJoinAuction = () => {
        navigate(`/main/auction/${auction.id}`);
    };

    const handleViewDetails = () => {
        navigate(`/main/auction/${auction.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <Card className="auction-card overflow-hidden h-full">
                <div className="relative">
                    <img
                        src={auction.imageUrl}
                        alt={auction.movieTitle}
                        className="object-cover w-full h-48"
                    />
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/70 text-white">
                            {auction.showtime}
                        </Badge>
                    </div>
                </div>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg line-clamp-1">{auction.movieTitle}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                                {auction.theater} • Seat {auction.seat}
                            </p>
                        </div>
                        <CountdownTimer
                            endTime={auction.endTime}
                            onExpire={() => setIsExpired(true)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-sm">
                            <User className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Seller:</span>
                            <span className="font-medium ml-1">{auction.sellerName}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium ml-1">Within 1km</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Current bid:</span>
                            <span className="font-bold ml-1 text-primary">₹{auction.currentBid}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                                (Base: ₹{auction.basePrice})
                            </span>
                        </div>
                        {auction.highestBidder && (
                            <div className="text-xs text-muted-foreground">
                                Highest bidder: <span className="font-medium">{auction.highestBidder}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="pt-2 flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-[50%]"
                        onClick={handleViewDetails}
                    >
                        Details
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        className="w-[50%] bg-primary hover:bg-primary/90"
                        onClick={handleJoinAuction}
                        disabled={isExpired}
                    >
                        {isExpired ? "Ended" : "Join Auction"}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default AuctionCard;