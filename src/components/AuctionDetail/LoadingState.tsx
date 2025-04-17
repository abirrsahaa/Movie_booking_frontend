import { memo } from "react";

import { motion } from "framer-motion";

const LoadingState = memo(() => (
    <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
        <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-primary/20 mb-6 animate-spin"></div>
                <div className="h-6 w-64 bg-muted rounded mb-4"></div>
                <div className="h-4 w-48 bg-muted/70 rounded"></div>
            </div>
        </motion.div>
    </div>
));

export default LoadingState;