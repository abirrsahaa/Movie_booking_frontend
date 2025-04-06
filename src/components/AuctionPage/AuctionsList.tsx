import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import AuctionCard from "./AuctionCard";
import { Auction } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockAuctions } from "@/constants/mockData";
import axios from "axios";

const AuctionsList = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("time");

    // !TODO: when we have movie details we can include this feature 

    // useEffect(() => {
    //     // Filter auctions based on search term
    //     const filtered = mockAuctions.filter((auction) =>
    //         auction.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         auction.theater.toLowerCase().includes(searchTerm.toLowerCase())
    //     );

    //     // Sort auctions based on sort criteria
    //     const sorted = [...filtered].sort((a, b) => {
    //         switch (sortBy) {
    //             case "price-low":
    //                 return a.currentBid - b.currentBid;
    //             case "price-high":
    //                 return b.currentBid - a.currentBid;
    //             case "time":
    //             default:
    //                 return a.endTime.getTime() - b.endTime.getTime();
    //         }
    //     });

    //     setAuctions(sorted);
    // }, [searchTerm, sortBy]);
    useEffect(() => {
        const gettingAuctions = async () => {
            try {
                // Fetch auctions from the backend
                const response = await axios.get("http://localhost:9090/auction/activeAuctions")
                const data: Auction[] = await response.data;
                setAuctions(data);
            } catch (error) {
                console.error("Error fetching auctions:", error);
            }
        }
        gettingAuctions();
    }, []);
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // if (auctions.length === 0) return <div>loading...</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-2">Movie Ticket Auctions</h1>
                <p className="text-center text-muted-foreground">
                    Find the best deals on movie tickets near you!
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search movies or theaters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Select
                        value={sortBy}
                        onValueChange={setSortBy}
                    >
                        <SelectTrigger className="w-44">
                            <div className="flex items-center">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Sort By" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="time">Ending Soon</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {auctions.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No auctions found.</p>
                    <Button variant="link" onClick={() => setSearchTerm("")}>
                        Clear search
                    </Button>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {auctions.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default AuctionsList;