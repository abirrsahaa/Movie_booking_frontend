import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HomePageMovie } from "@/interfaces/interfaces_All";
import axios from "axios";
import { Link } from "react-router-dom";

const NowShowing: React.FC = () => {
  const [nowShowing, setNowShowing] = useState<HomePageMovie[]>([]);

  // Fetch movies on component mount
  useEffect(() => {
    const getting = async () => {
      const response = await axios.get("http://localhost:9090/nowShowing");
      console.log(response.data);
      setNowShowing(response.data);
    };
    getting();
  }, []);

  // Framer Motion Variants for Staggered Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Now Showing</h2>
        <Link to="/movies" className="text-blue-800 hover:underline">
          View All
        </Link>
      </div>

      {nowShowing.length === 0 ? (
        <p>Loading movies...</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {nowShowing.map((movie) => (
            <motion.div
              key={movie.id}
              variants={itemVariants} // Apply animation to each card
              whileHover={{ scale: 1.05 }} // Hover effect
              className="transform transition-transform duration-200"
            >
              <Card className="flex flex-col h-full overflow-hidden">
                <Link to={`/main/moviesSpecific/${movie.id}`} className="relative">
                  <div className="relative">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    {movie.isNew && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        NEW
                      </Badge>
                    )}
                  </div>
                </Link>

                <CardContent className="flex flex-col flex-grow p-4">
                  <h3 className="text-lg text-blue-800 font-semibold mb-2">{movie.title}</h3>
                  <div className="mb-4">
                    <Badge variant="secondary">{movie.type}</Badge>
                  </div>
                  <div className="mt-auto">
                    <Button
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                      asChild
                    >
                      <Link to={`/main/moviesSpecific/${movie.id}`}>Book</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default NowShowing;