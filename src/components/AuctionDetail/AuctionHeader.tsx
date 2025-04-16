
import { memo } from "react";

import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";


const AuctionHeader = memo(({ auction }) => (
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
    </Card>
));

export default AuctionHeader;