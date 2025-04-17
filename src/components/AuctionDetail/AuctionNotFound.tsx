import { memo } from "react";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const AuctionNotFound = memo(({ onBackClick }) => (
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
            <Button onClick={onBackClick} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Auctions
            </Button>
        </motion.div>
    </div>
));
export default AuctionNotFound;