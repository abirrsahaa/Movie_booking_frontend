import { ComingSoonProps, HomePageMovie } from "@/interfaces/interfaces_All";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import axios from "axios";


const ComingSoon: React.FC<ComingSoonProps> = ({containerVariants,itemVariants}) => {
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

      if(comingSoon.length===0)return <p>Loading movies...</p>

    return (
        <section className="py-12 container mx-auto px-4 bg-gray-100 dark:bg-gray-800/50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold dark:text-white">Coming Soon</h2>
          <Button variant="ghost" className="text-sm">View All</Button>
        </div>
      
        {comingSoon.length === 0 ? (
          // Show a loading spinner or a placeholder when data is being fetched
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 dark:text-gray-400">Loading upcoming movies...</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants} // Parent animation for staggered children
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }} // Trigger animation every time the section is in view
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {comingSoon.map((movie) => (
              <motion.div key={movie.id} variants={itemVariants}> {/* Child animation */}
                <Card className="overflow-hidden h-full transition-all hover:shadow-lg group dark:bg-gray-800">
                  <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700">
                    <Badge className="absolute top-2 right-2 bg-blue-500">SOON</Badge>
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
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
        )}
      </section>
    )
}

export default ComingSoon;