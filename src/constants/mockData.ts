import { Auction } from "@/types";


// Current time + 10 minutes for auction end time
const getTenMinutesFromNow = () => {
    const now = new Date();
    return new Date(now.getTime() + 10 * 60 * 1000);
};

export const mockAuctions: Auction[] = [
    {
        id: '1',
        movieTitle: 'Avengers: Endgame',
        theater: 'PVR Cinemas',
        showtime: '8:30 PM',
        seat: 'G12',
        sellerName: 'John Doe',
        basePrice: 250,
        currentBid: 320,
        highestBidder: 'Alice',
        endTime: getTenMinutesFromNow(),
        imageUrl: 'https://tinyurl.com/2vhkzbm6', // Avengers Endgame poster URL
        location: {
            latitude: 12.9716,
            longitude: 77.5946
        },
        description: 'Premium seat with great view. Need to sell as I can\'t make it to the show.',
        bids: [
            { id: 'b1', auctionId: '1', bidder: 'Bob', amount: 280, timestamp: new Date() },
            { id: 'b2', auctionId: '1', bidder: 'Charlie', amount: 300, timestamp: new Date() },
            { id: 'b3', auctionId: '1', bidder: 'Alice', amount: 320, timestamp: new Date() }
        ]
    },
    {
        id: '2',
        movieTitle: 'Inception',
        theater: 'INOX',
        showtime: '9:00 PM',
        seat: 'D8',
        sellerName: 'Jane Smith',
        basePrice: 200,
        currentBid: 230,
        highestBidder: 'David',
        endTime: getTenMinutesFromNow(),
        imageUrl: 'https://tinyurl.com/5n6r3v3s', // Inception poster URL
        location: {
            latitude: 12.9767,
            longitude: 77.5713
        },
        description: 'Recliner seat in the middle row. Perfect viewing experience.',
        bids: [
            { id: 'b4', auctionId: '2', bidder: 'Eve', amount: 210, timestamp: new Date() },
            { id: 'b5', auctionId: '2', bidder: 'David', amount: 230, timestamp: new Date() }
        ]
    },
    {
        id: '3',
        movieTitle: 'Dune: Part Two',
        theater: 'Cinepolis',
        showtime: '7:15 PM',
        seat: 'J5',
        sellerName: 'Michael Johnson',
        basePrice: 300,
        currentBid: 380,
        highestBidder: 'Frank',
        endTime: getTenMinutesFromNow(),
        imageUrl: 'https://tinyurl.com/bdfstyhw', // Dune Part Two poster URL
        location: {
            latitude: 12.9810,
            longitude: 77.6094
        },
        description: 'IMAX experience. Center seat with excellent sound quality.',
        bids: [
            { id: 'b6', auctionId: '3', bidder: 'Grace', amount: 350, timestamp: new Date() },
            { id: 'b7', auctionId: '3', bidder: 'Frank', amount: 380, timestamp: new Date() }
        ]
    },
    {
        id: '4',
        movieTitle: 'Oppenheimer',
        theater: 'PVR IMAX',
        showtime: '6:45 PM',
        seat: 'H10',
        sellerName: 'Sarah Williams',
        basePrice: 350,
        currentBid: 410,
        highestBidder: 'Helen',
        endTime: getTenMinutesFromNow(),
        imageUrl: 'https://tinyurl.com/bdha9n9b', // Oppenheimer poster URL
        location: {
            latitude: 12.9346,
            longitude: 77.6147
        },
        description: 'IMAX experience with Dolby Atmos sound. Premium recliner seat.',
        bids: [
            { id: 'b8', auctionId: '4', bidder: 'Ivan', amount: 370, timestamp: new Date() },
            { id: 'b9', auctionId: '4', bidder: 'Helen', amount: 410, timestamp: new Date() }
        ]
    },
    {
        id: '5',
        movieTitle: 'Deadpool & Wolverine',
        theater: 'INOX Multiplex',
        showtime: '10:00 PM',
        seat: 'F7',
        sellerName: 'Robert Brown',
        basePrice: 280,
        currentBid: 340,
        highestBidder: 'Kevin',
        endTime: getTenMinutesFromNow(),
        imageUrl: 'https://tinyurl.com/548vpzau', // Deadpool & Wolverine poster
        location: {
            latitude: 12.9583,
            longitude: 77.6485
        },
        description: 'Luxury recliner seat with complimentary popcorn and drink.',
        bids: [
            { id: 'b10', auctionId: '5', bidder: 'James', amount: 310, timestamp: new Date() },
            { id: 'b11', auctionId: '5', bidder: 'Kevin', amount: 340, timestamp: new Date() }
        ]
    }
];

export const getCurrentUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        }
    });
};

export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
};
