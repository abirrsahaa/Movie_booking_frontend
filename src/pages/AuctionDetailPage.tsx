import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Client as StompClient } from "@stomp/stompjs";
import { Auction } from "@/types";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Clock,
    MapPin,
    User,
    ArrowLeft,
    CalendarClock,
    Ticket,
    AlertTriangle,
    Tag,
    Sparkles,
    TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import CountdownTimer from "@/components/AuctionPage/CountDownTimer";
import BidHistory from "@/components/AuctionPage/BidHistory";
import PlaceBidForm from "@/components/AuctionPage/PlaceBidForm";
import { useAppSelector } from "@/store/store";

export const SOCKET_URL = "http://localhost:9090/ws"; // WebSocket endpoint
const API_URL = "http://localhost:9090/auction/auctionDetails"; // API base URL

const AuctionDetailPage = () => {
    const { userData, isAuthenticated } = useAppSelector((state) => state.user);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const [auction, setAuction] = useState<Auction | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isAuctionEnded, setIsAuctionEnded] = useState(false);
    const [bidSuccess, setBidSuccess] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/${id}`);
                setAuction(response.data);
            } catch (error) {
                console.error("Error fetching auction details:", error);
                toast.error("Failed to load auction details.");
            } finally {
                setLoading(false);
            }
        };

        // Fetch initial auction details
        fetchAuctionDetails();

        // WebSocket connection to listen for updates
        const socket = new SockJS(SOCKET_URL);
        const client = new StompClient({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            connectionTimeout: 10000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket server via SockJS");
            // idhar changes karne hai according to requirements 
            client.subscribe(`/topic/auction/${id}`, async (message) => {
                console.log("Received WebSocket message:", message.body);
                // here get the leaderboard
                // setAuction(updatedAuction);
                fetchAuctionDetails();
            });

            client.subscribe(`/topic/auction-updates`, async (message) => {
                console.log("Received auction updates:", message.body);
                toast.info("Auction updated! Check your payments page for more details", {
                    duration: 5000,
                    icon: <Sparkles className="h-5 w-5 text-amber-400" />
                });
                // here get the leaderboard
                // setAuction(updatedAuction);
                // fetchAuctionDetails();
            });
        };

        client.onStompError = (frame) => {
            console.error("STOMP error", frame);
            toast.error("Connection error. Please try again later.");
        };

        client.activate();

        // Cleanup WebSocket connection on component unmount
        return () => {
            client.deactivate();
        };
    }, [id]);

    const handlePlaceBid = async (amount: number) => {
        if (!auction || !userData) {
            toast.error("You must be logged in to place a bid.");
            return;
        }

        const requestBody = {
            auctionId: auction.id,
            userId: userData.id, // Assuming `userData.id` contains the logged-in user's ID
            amount: amount,
        };

        try {
            // Send the bid to the backend
            const response = await axios.post(`http://localhost:9090/auction/handleBid/${auction.id}`, requestBody);
            console.log("Bid response:", response.data);

            // Show success animation
            setBidSuccess(true);
            setTimeout(() => setBidSuccess(false), 2000);

            toast.success("Your bid has been placed successfully!", {
                duration: 3000,
                icon: <TrendingUp className="h-5 w-5 text-green-500" />
            });
        } catch (error) {
            console.error("Error placing bid:", error);
            toast.error("Failed to place bid. Please try again.");
        }
    };

    const handleAuctionEnd = () => {
        setIsAuctionEnded(true);
        toast.info("This auction has ended!", {
            icon: <Clock className="h-5 w-5 text-orange-500" />
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-24 w-24 rounded-full bg-primary/20 mb-6 animate-spin"></div>
                        <div className="h-6 w-64 bg-muted rounded mb-4"></div>
                        <div className="h-4 w-48 bg-muted/70 rounded"></div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-md w-full p-8 rounded-xl bg-card shadow-lg border border-border/50"
                >
                    <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Auction Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        The auction you're looking for doesn't exist or has been removed.
                    </p>
                    <Button onClick={() => navigate("/main/auctions")} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all w-full">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Auctions
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto px-4 py-8 min-h-screen"
        >
            <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 p-2 -mx-4 px-4 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="group transition-all duration-300"
                    onClick={() => navigate("/main/auctions")}
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Auctions</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Movie and Auction Details */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2"
                >
                    <Card className="overflow-hidden shadow-lg border-primary/10 mb-8">
                        <div className="relative h-48 md:h-64 overflow-hidden">
                            <motion.div
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute inset-0"
                            >
                                <div
                                    style={{
                                        backgroundImage: `url(${auction.imageUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        filter: 'blur(20px)',
                                        opacity: 0.3,
                                        width: '100%',
                                        height: '100%'
                                    }}
                                ></div>
                            </motion.div>

                            <div className="absolute inset-0 flex flex-col md:flex-row gap-6 p-6">
                                <div className="w-24 h-36 md:w-32 md:h-48 rounded-lg shadow-2xl overflow-hidden flex-shrink-0">
                                    <motion.img
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        src={auction.imageUrl}
                                        alt={auction.movieTitle}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 z-10">
                                    <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                    >
                                        <h1 className="text-3xl md:text-4xl font-bold text-foreground drop-shadow-sm">{auction.movieTitle}</h1>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground">{auction.theater}</Badge>
                                            <Badge variant="outline" className="border-primary/30 text-foreground">Seat {auction.seat}</Badge>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                                <div className="mb-4 sm:mb-0">
                                    <div className="flex items-center">
                                        <Tag className="h-5 w-5 mr-2 text-orange-500" />
                                        <span className="text-muted-foreground mr-2">Current Bid:</span>
                                        <motion.span
                                            className="font-bold text-lg text-primary"
                                            key={auction.currentBid} // Force animation when bid changes
                                            initial={{ scale: 1.2, color: "#22c55e" }}
                                            animate={{ scale: 1, color: "hsl(var(--primary))" }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            ₹{auction.currentBid || auction.basePrice}
                                        </motion.span>
                                    </div>
                                    {auction.highestBidder && (
                                        <span className="ml-7 text-xs text-muted-foreground">
                                            by {auction.highestBidder}
                                        </span>
                                    )}
                                </div>

                                <div className="bg-muted/50 p-3 rounded-lg">
                                    <CountdownTimer
                                        endTime={auction.endTime}
                                        onExpire={handleAuctionEnd}
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
                    </Card>

                    <motion.div variants={itemVariants} className="mb-6">
                        <BidHistory bids={auction.bids || []} />
                    </motion.div>
                </motion.div>

                {/* Right Column: Bid Form */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-1"
                >
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
                                    <PlaceBidForm auction={auction} onPlaceBid={handlePlaceBid} />
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
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AuctionDetailPage;