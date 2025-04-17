import { memo } from "react";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";

const CurrentBidDisplay = memo(({ currentBid, highestBidder }) => (
    <div className="mb-4 sm:mb-0">
        <div className="flex items-center">
            <Tag className="h-5 w-5 mr-2 text-orange-500" />
            <span className="text-muted-foreground mr-2">Current Bid:</span>
            <motion.span
                className="font-bold text-lg text-primary"
                key={currentBid} // Force animation when bid changes
                initial={{ scale: 1.2, color: "#22c55e" }}
                animate={{ scale: 1, color: "hsl(var(--primary))" }}
                transition={{ duration: 0.5 }}
            >
                ₹{currentBid || '0'}
            </motion.span>
        </div>
        {highestBidder && (
            <span className="ml-7 text-xs text-muted-foreground">
                by {highestBidder}
            </span>
        )}
    </div>
));

export default CurrentBidDisplay;