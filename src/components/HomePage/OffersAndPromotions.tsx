import { OffersAndPromotionsProps, PromoOffer } from "@/interfaces/interfaces_All";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";



const OffersAndPromotions: React.FC<OffersAndPromotionsProps> = ({containerVariants,itemVariants}) => {
        const [offers, setOffers] = useState<PromoOffer[]>([
            { 
              id: 1, 
              title: 'Credit Card Offer', 
              description: '10% off with HDFC Cards',
              code: 'HDFC10'
            },
            { 
              id: 2, 
              title: 'Wallet Offer', 
              description: 'Cashback with PayTM',
              code: 'PAYTM20'
            },
            { 
              id: 3, 
              title: 'Free Snacks', 
              description: 'Free Popcorn on Weekdays',
              code: 'POPCORN'
            },
          ]);
    return (
        <section className="py-12 container mx-auto px-4 bg-gray-100 dark:bg-gray-800/50">
        <h2 className="text-3xl font-bold mb-8 dark:text-white">Offers & Promotions</h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {offers.map((offer) => (
            <motion.div key={offer.id} variants={itemVariants}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">{offer.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{offer.description}</p>
                  {offer.code && (
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-center font-mono mb-4">
                      {offer.code}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full">Apply Now</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
    )
}

export default OffersAndPromotions;