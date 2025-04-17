
export interface Auction {
    id?: string; // Matches Long id in backend
    movieTitle?: string; // Matches String movieTitle
    theater?: string; // Matches String theater
    showtime?: string; // Matches String showtime
    seat?: string; // Matches String seat
    sellerName?: string; // Matches String sellerName
    basePrice?: number; // Matches Long basePrice
    currentBid?: number; // Matches Long currentBid
    highestBidder?: string | null; // Matches String highestBidder
    endTime?: string; // Changed to string to match LocalDateTime in backend
    imageUrl?: string; // Matches String imageUrl
    description?: string; // Matches String description
    bids?: Bid[]; // Matches List<BidDTO> bids
}


export interface Bid {
    id?: string;
    auctionId?: string;
    bidder?: string | number;
    amount?: number;
    timestamp?: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
}
