import { memo } from "react";

import { motion } from "framer-motion";
import BidHistory from "../AuctionPage/BidHistory";

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};



const BidHistorySection = memo(({ bids }) => (
    <motion.div variants={itemVariants} className="mb-6">
        <BidHistory bids={bids || []} />
    </motion.div>
));

export default BidHistorySection;