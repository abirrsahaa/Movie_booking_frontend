import { Bid } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface BidHistoryProps {
    bids: Bid[];
}

const BidHistory = ({ bids }: BidHistoryProps) => {
    // Sort bids by amount in descending order (highest to lowest)
    const sortedBids = [...bids].sort((a, b) => (b?.amount ?? 0) - (a.amount ?? 0));

    return (
        <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-medium mb-3">Bid History</h3>
            {sortedBids.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                    No bids yet. Be the first to bid!
                </p>
            ) : (
                <ScrollArea className="h-[200px] rounded-md">
                    <div className="space-y-2">
                        {sortedBids.map((bid) => (
                            <div
                                key={bid.id}
                                className="flex justify-between items-center text-sm p-2 border-b border-border last:border-0"
                            >
                                <div className="flex-1">
                                    <span className="font-medium">{bid.bidder}</span>
                                    <p className="text-xs text-muted-foreground">
                                        {format(bid.timestamp ?? new Date(), "MMM d, h:mm a")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-primary">₹{bid.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};

export default BidHistory;