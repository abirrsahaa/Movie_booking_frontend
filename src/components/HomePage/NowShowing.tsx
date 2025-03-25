import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HomePageMovie, NowShowingProps } from "@/interfaces/interfaces_All";
import axios from "axios";




const NowShowing: React.FC<NowShowingProps> = ({  containerVariants, itemVariants }) => {
    const [nowShowing, setNowShowing] = useState<HomePageMovie[]>([
        // { id: 1, title: 'Oppenheimer', image: '/movies/oppenheimer.jpg', type: 'IMAX', isNew: true },
        // { id: 2, title: 'Barbie', image: '/movies/barbie.jpg', type: 'DOLBY', isNew: true },
        // { id: 3, title: 'Mission Impossible', image: '/movies/mission.jpg', type: 'DIGITAL' },
        // { id: 4, title: 'Ant Man', image: '/movies/antman.jpg', type: 'IMAX', isNew: true },
        // { id: 5, title: 'John Wick', image: '/movies/johnwick.jpg', type: 'DOLBY', isNew: true },
      ]);
    
      useEffect(()=>{
        const getting=async ()=>{const getting=await axios.get("http://localhost:9090/nowShowing");
        console.log(getting.data);
        setNowShowing(getting.data);
        }
        getting();
    
      },[])
  return (
    <section className="py-12 container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold dark:text-white">Now Showing</h2>
        <Button variant="ghost" className="text-sm">
          View All
        </Button>
      </div>

      {nowShowing.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading movies...</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {nowShowing.map((movie) => (
            <motion.div key={movie.id} variants={itemVariants}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-lg group dark:bg-gray-800">
                <div className="relative aspect-[2/3] bg-gray-100 dark:bg-gray-700">
                  {movie.isNew && (
                    <Badge className="absolute top-2 right-2 bg-yellow-400 text-black">NEW</Badge>
                  )}
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold dark:text-white">{movie.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {movie.type}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                      Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default NowShowing;