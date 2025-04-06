import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Client as StompClient } from "@stomp/stompjs";
import { Auction, Bid } from "@/types";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, MapPin, User, ArrowLeft, CalendarClock, Ticket, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import CountdownTimer from "@/components/AuctionPage/CountDownTimer";
import BidHistory from "@/components/AuctionPage/BidHistory";
import PlaceBidForm from "@/components/AuctionPage/PlaceBidForm";
import { useAppSelector } from "@/store/store";

const SOCKET_URL = "http://localhost:9090/ws"; // WebSocket endpoint
const API_URL = "http://localhost:9090/auction/auctionDetails"; // API base URL

const AuctionDetailPage = () => {
    const { userData, isAuthenticated, isLoading, error } = useAppSelector((state) => state.user);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const [auction, setAuction] = useState<Auction | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isAuctionEnded, setIsAuctionEnded] = useState(false);

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
            client.subscribe(`/topic/auction/${id}`, async (message) => {
                console.log("Received WebSocket message:", message.body);
                // here get the leaderboard
                // setAuction(updatedAuction);
                fetchAuctionDetails();
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

            // Update the auction state with the response from the backend
            // const updatedAuction = response.data;
            // setAuction(updatedAuction);

            toast.success("Your bid has been placed successfully!");
        } catch (error) {
            console.error("Error placing bid:", error);
            toast.error("Failed to place bid. Please try again.");
        }
    };

    const handleAuctionEnd = () => {
        setIsAuctionEnded(true);
        toast.info("This auction has ended!");
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-12 w-48 bg-muted rounded mb-4"></div>
                        <div className="h-4 w-64 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
                <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Auction Not Found</h1>
                <p className="text-muted-foreground mb-6">
                    The auction you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate("/main/auctions")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Auctions
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                size="sm"
                className="mb-6"
                onClick={() => navigate("/main/auctions")}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Auctions
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Movie and Auction Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-2"
                >
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                        <div className="w-full md:w-1/3">
                            <img
                                src={auction.imageUrl}
                                alt={auction.movieTitle}
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start gap-4">
                                <h1 className="text-3xl font-bold mb-2">{auction.movieTitle}</h1>
                                {/* {!isMobile && (
                                    <CountdownTimer
                                        endTime={auction?.endTime} // Ensure auction.endTime is a valid Date or string
                                        onExpire={() => {
                                            setIsAuctionEnded(true);
                                            toast.info("This auction has ended!");
                                        }}
                                        className="mt-1"
                                    />
                                )} */}
                            </div>

                            {isMobile && (
                                <div className="mb-3">
                                    <CountdownTimer
                                        endTime={auction.endTime}
                                        onExpire={handleAuctionEnd}
                                    />
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge>{auction.theater}</Badge>
                                <Badge variant="outline">Seat {auction.seat}</Badge>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center">
                                    <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-2">Showtime:</span>
                                    <span>{auction.showtime}</span>
                                </div>
                                <div className="flex items-center">
                                    <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-2">Base Price:</span>
                                    <span>₹{auction.basePrice}</span>
                                </div>
                                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-2">Seller:</span>
                                    <span>{auction.sellerName}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-2">Location:</span>
                                    <span>Within 1km of the theater</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-2">Current Bid:</span>
                                    <span className="font-bold text-primary">
                                        ₹{auction.currentBid || "No bids yet"}
                                    </span>
                                    {auction.highestBidder && (
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            by {auction.highestBidder}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-3">About This Ticket</h2>
                        <p className="text-muted-foreground">{auction.description}</p>

                        <Separator className="my-4" />

                        <div>
                            <h3 className="font-medium mb-2">Important Information</h3>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                                <li>This auction will end in exactly 10 minutes.</li>
                                <li>You must be within 1km of the theater to participate.</li>
                                <li>Winning bidders must meet the seller to complete the transaction.</li>
                                <li>The seller is responsible for transferring the ticket securely.</li>
                            </ul>
                        </div>
                    </Card>

                    <div className="mb-6">
                        <BidHistory bids={auction.bids || []} />
                    </div>
                </motion.div>

                {/* Right Column: Bid Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card className="p-6 h-fit sticky top-6">
                        <h2 className="text-xl font-semibold mb-4">Place Your Bid</h2>
                        {isAuctionEnded ? (
                            <div className="text-center py-6">
                                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <h3 className="text-lg font-medium mb-2">Auction Ended</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    This auction has ended and is no longer accepting bids.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate("/auctions")}
                                >
                                    Browse Other Auctions
                                </Button>
                            </div>
                        ) : (
                            <PlaceBidForm auction={auction} onPlaceBid={handlePlaceBid} />
                        )}
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default AuctionDetailPage;