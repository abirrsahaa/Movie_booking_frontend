import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { TabsContent } from "../ui/tabs";
import { ReviewsTabProps } from "@/interfaces/interfaces_All";





const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews }) => {
    return (
        <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{review.name}</h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">{review.publication}</p>
                        </div>
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, j) => (
                              <Star
                                key={j}
                                className={`w-4 h-4 ${
                                  j < review.rating
                                    ? "fill-yellow-400 stroke-yellow-400"
                                    : "stroke-zinc-300 dark:stroke-zinc-600"
                                }`}
                              />
                            ))}
                        </div>
                      </div>
                      <p className="text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
    )
}
export default ReviewsTab;