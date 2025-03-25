


import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { HomePageMovie, PromoOffer, QuickLinkProps } from "@/interfaces/interfaces_All";
import axios from "axios";





const QuickLinks: React.FC<QuickLinkProps> = ({fadeInVariants,containerVariants,itemVariants}) => {
    const [comingSoon, setComingSoon] = useState<HomePageMovie[]>([
        // { id: 6, title: 'Deadpool 3', image: '/movies/deadpool3.jpg', type: 'IMAX' },
        // { id: 7, title: 'Dune 2', image: '/movies/dune2.jpg', type: 'DOLBY' },
        // { id: 8, title: 'Fast X', image: '/movies/fastx.jpg', type: 'DIGITAL' },
        // { id: 9, title: 'The Marvels', image: '/movies/marvels.jpg', type: 'IMAX' },
      ]);
    
      useEffect(()=>{
        const getting=async ()=>{const getting=await axios.get("http://localhost:9090/comingSoon");
        console.log(getting.data);
        setComingSoon(getting.data);
        }
        getting();
    
      },[])
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
        <section className="py-12 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 dark:text-white">Quick Links</h2>
        
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="mb-6 w-full sm:w-auto flex flex-wrap">
              {/* <TabsTrigger value="current">Current Movies</TabsTrigger> */}
              <TabsTrigger value="latest">Latest Releases</TabsTrigger>
              <TabsTrigger value="theaters">Movie Theaters</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Movies</TabsTrigger>
              <TabsTrigger value="gift">Gift Cards</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="latest" className="mt-0">
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                {comingSoon.map((movie:HomePageMovie) => (
                  <motion.div key={movie.id} variants={itemVariants}>
                    <Card className="overflow-hidden h-full transition-all hover:shadow-lg group dark:bg-gray-800">
                      <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700">
                        <Badge className="absolute top-2 right-2 bg-blue-500">SOON</Badge>
                        <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold dark:text-white">{movie.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{movie.type}</p>
                        <div className="mt-4">
                          <Button size="sm" variant="outline" className="w-full">Notify Me</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="theaters" className="mt-0">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden h-full transition-all hover:shadow-lg group dark:bg-gray-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold dark:text-white">IMAX Theaters</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Experience movies in IMAX format.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden h-full transition-all hover:shadow-lg group dark:bg-gray-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold dark:text-white">Dolby Cinema</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enjoy movies with Dolby sound and visuals.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-0">
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                {comingSoon.map((movie:HomePageMovie) => (
                  <motion.div key={movie.id} variants={itemVariants}>
                    <Card className="overflow-hidden h-full transition-all hover:shadow-lg group dark:bg-gray-800">
                      <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700">
                        <Badge className="absolute top-2 right-2 bg-blue-500">SOON</Badge>
                        <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold dark:text-white">{movie.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{movie.type}</p>
                        <div className="mt-4">
                          <Button size="sm" variant="outline" className="w-full">Notify Me</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="gift" className="mt-0">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden h-full transition-all hover:shadow-lg group dark:bg-gray-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold dark:text-white">Digital Gift Cards</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Give the gift of movies with our digital gift cards.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden h-full transition-all hover:shadow-lg group dark:bg-gray-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold dark:text-white">Physical Gift Cards</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Purchase physical gift cards for your loved ones.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="offers" className="mt-0">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                {offers.map((offer) => (
                  <motion.div key={offer.id} variants={itemVariants}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-lg dark:bg-gray-800">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 dark:text-white">{offer.title}</h3>
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
            </TabsContent>
          </Tabs>
        </motion.div>
      </section>
    )
}

export default QuickLinks;