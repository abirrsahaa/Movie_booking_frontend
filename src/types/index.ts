export interface Auction {
    id: string;
    movieTitle: string;
    theater: string;
    showtime: string;
    seat: string;
    sellerName: string;
    basePrice: number;
    currentBid: number;
    highestBidder: string | null;
    endTime: Date;
    imageUrl: string;
    location: {
        latitude: number;
        longitude: number;
    };
    description: string;
    bids: Bid[];
}

export interface Bid {
    id: string;
    auctionId: string;
    bidder: string;
    amount: number;
    timestamp: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
}
