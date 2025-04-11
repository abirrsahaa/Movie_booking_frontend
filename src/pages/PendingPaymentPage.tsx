import React, { useState } from 'react';
import { Check, X, Ticket, Calendar, Clock, User, DollarSign, ChevronRight, CreditCard, ChevronDown, ChevronUp, Filter, AlertCircle, Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function IntegratedAuctionUI() {
    const [selectedAuction, setSelectedAuction] = useState<number | null>(null);
    const [auctions, setAuctions] = useState([
        {
            id: 1,
            status: 'pending',
            movieTitle: "Dune: Part Two",
            date: "April 15, 2025",
            time: "7:30 PM",
            seats: "G5, G6",
            theater: "Cinema City - IMAX",
            originalPrice: "$28.00",
            bidAmount: "$42.50",
            seller: "JohnDoe123",
            expiresIn: "12:45", // minutes:seconds
            timeLeft: "plenty" // plenty, warning, critical
        },
        {
            id: 2,
            status: 'pending',
            movieTitle: "Avengers: Secret Wars",
            date: "April 17, 2025",
            time: "8:00 PM",
            seats: "D10, D11, D12",
            theater: "Regal Cinemas - Screen 3",
            originalPrice: "$36.00",
            bidAmount: "$52.00",
            seller: "MarvelFan42",
            expiresIn: "08:21", // minutes:seconds
            timeLeft: "warning" // plenty, warning, critical
        },
        {
            id: 3,
            status: 'pending',
            movieTitle: "The Batman: Gotham Nights",
            date: "April 20, 2025",
            time: "9:15 PM",
            seats: "J4",
            theater: "AMC Premium - Dolby",
            originalPrice: "$18.50",
            bidAmount: "$26.75",
            seller: "GothamKnight",
            expiresIn: "03:12", // minutes:seconds
            timeLeft: "critical" // plenty, warning, critical
        }
    ]);

    const [sortBy, setSortBy] = useState('expiring');
    const [showFilters, setShowFilters] = useState(false);

    const handleAccept = (id) => {
        setAuctions(auctions.map(auction =>
            auction.id === id ? { ...auction, status: 'accepted' } : auction
        ));
        // Here you would integrate with your payment processing
        setTimeout(() => {
            setAuctions(auctions.map(auction =>
                auction.id === id ? { ...auction, status: 'pending' } : auction
            ));
        }, 3000);
    };

    const handleReject = (id) => {
        setAuctions(auctions.map(auction =>
            auction.id === id ? { ...auction, status: 'rejected' } : auction
        ));
        // Here you would handle the rejection logic
        setTimeout(() => {
            setAuctions(auctions.map(auction =>
                auction.id === id ? { ...auction, status: 'pending' } : auction
            ));
        }, 3000);
    };

    const getStatusColor = (timeLeft) => {
        switch (timeLeft) {
            case 'critical': return 'bg-red-100 text-red-700';
            case 'warning': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-green-100 text-green-700';
        }
    };

    const getStatusIcon = (timeLeft) => {
        switch (timeLeft) {
            case 'critical': return <AlertCircle className="w-4 h-4 mr-1" />;
            case 'warning': return <Clock className="w-4 h-4 mr-1" />;
            default: return <Check className="w-4 h-4 mr-1" />;
        }
    };

    const pendingAuctions = auctions.filter(auction => auction.status === 'pending');
    const totalAmount = pendingAuctions.reduce((total, auction) =>
        total + parseFloat(auction.bidAmount.replace('$', '')), 0).toFixed(2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Pending Payments</h1>
                    <div className="relative">
                        <button
                            className="bg-white p-2 rounded-full shadow-md relative"
                            onClick={() => { }}
                        >
                            <Bell className="w-6 h-6 text-gray-700" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {pendingAuctions.length}
                            </span>
                        </button>
                    </div>
                </div>

                {pendingAuctions.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <span className="text-gray-700 font-medium">Total:</span>
                                <span className="text-lg font-bold text-blue-600 ml-2">${totalAmount}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="flex items-center text-gray-600 hover:text-gray-800"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="w-4 h-4 mr-1" />
                                    Filter
                                    {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                                </button>
                                <select
                                    className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="expiring">Expiring Soon</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="date">Event Date</option>
                                </select>
                            </div>
                        </div>

                        {showFilters && (
                            <motion.div
                                className="bg-gray-50 p-3 rounded-lg mb-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Price Range</label>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Min" className="border rounded px-2 py-1 w-full" />
                                            <input type="text" placeholder="Max" className="border rounded px-2 py-1 w-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Theater</label>
                                        <select className="border rounded px-2 py-1 w-full">
                                            <option value="">All Theaters</option>
                                            <option>Cinema City - IMAX</option>
                                            <option>Regal Cinemas</option>
                                            <option>AMC Premium</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-3">
                                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Apply</button>
                                </div>
                            </motion.div>
                        )}

                        <motion.button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <CreditCard className="w-5 h-5" />
                            Pay All (${totalAmount})
                        </motion.button>
                    </div>
                )}

                <div className="space-y-4">
                    {auctions.map(auction => (
                        <AnimatePresence key={auction.id} mode="wait">
                            {auction.status === 'pending' && (
                                <motion.div
                                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {selectedAuction !== auction.id ? (
                                        // Collapsed card view
                                        <div
                                            className="p-4 cursor-pointer"
                                            onClick={() => setSelectedAuction(auction.id)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{auction.movieTitle}</h3>
                                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {auction.date} • {auction.time}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="font-bold text-blue-600">{auction.bidAmount}</span>
                                                    <div className={`flex items-center text-xs mt-1 px-2 py-1 rounded-full ${getStatusColor(auction.timeLeft)}`}>
                                                        {getStatusIcon(auction.timeLeft)}
                                                        Expires in {auction.expiresIn}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Expanded detailed card (previous UI design)
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 px-6 flex justify-between items-center">
                                                <div>
                                                    <h2 className="text-white text-xl font-semibold">Auction Won!</h2>
                                                    <p className="text-blue-100">Complete your payment to secure tickets</p>
                                                </div>
                                                <button
                                                    className="text-white bg-white bg-opacity-20 rounded-full p-1 hover:bg-opacity-30"
                                                    onClick={() => setSelectedAuction(null)}
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="p-6">
                                                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                                    <h3 className="text-lg font-semibold text-gray-800">{auction.movieTitle}</h3>
                                                    <div className={`flex items-center text-xs px-3 py-1 rounded-full ${getStatusColor(auction.timeLeft)}`}>
                                                        {getStatusIcon(auction.timeLeft)}
                                                        Expires in {auction.expiresIn}
                                                    </div>
                                                </div>

                                                <div className="py-4 space-y-3">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                                                        <span className="text-gray-700">{auction.date}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="w-5 h-5 text-gray-500 mr-3" />
                                                        <span className="text-gray-700">{auction.time}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Ticket className="w-5 h-5 text-gray-500 mr-3" />
                                                        <span className="text-gray-700">{auction.seats} • {auction.theater}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <User className="w-5 h-5 text-gray-500 mr-3" />
                                                        <span className="text-gray-700">Seller: {auction.seller}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 -mx-6 p-6 mt-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600">Original Price</span>
                                                        <span className="text-gray-700 line-through">{auction.originalPrice}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-gray-600">Your Winning Bid</span>
                                                        <span className="text-lg font-bold text-blue-600">{auction.bidAmount}</span>
                                                    </div>

                                                    <p className="text-sm text-gray-500 mb-6">
                                                        Payment must be completed within 15 minutes or tickets will be released.
                                                    </p>

                                                    <div className="flex gap-3">
                                                        <motion.button
                                                            onClick={() => handleAccept(auction.id)}
                                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2"
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <CreditCard className="w-5 h-5" />
                                                            Pay Now
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleReject(auction.id)}
                                                            className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2"
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <X className="w-5 h-5" />
                                                            Decline
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {auction.status === 'accepted' && (
                                <motion.div
                                    className="bg-white rounded-xl shadow-lg p-8 text-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{auction.movieTitle}</h2>
                                    <p className="text-gray-600 mb-6">Your tickets have been secured and sent to your email.</p>
                                    <motion.button
                                        className="inline-flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        View Tickets <ChevronRight className="w-4 h-4 ml-1" />
                                    </motion.button>
                                </motion.div>
                            )}

                            {auction.status === 'rejected' && (
                                <motion.div
                                    className="bg-white rounded-xl shadow-lg p-8 text-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <X className="w-8 h-8 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{auction.movieTitle}</h2>
                                    <p className="text-gray-600 mb-6">You've declined this auction win. The tickets will be offered to other bidders.</p>
                                    <motion.button
                                        className="inline-flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Back to Auctions <ChevronRight className="w-4 h-4 ml-1" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ))}
                </div>

                {pendingAuctions.length === 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Ticket className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Pending Payments</h2>
                        <p className="text-gray-600 mb-6">You don't have any auction wins waiting for payment.</p>
                        <motion.button
                            className="inline-flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Browse Auctions <ChevronRight className="w-4 h-4 ml-1" />
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
}