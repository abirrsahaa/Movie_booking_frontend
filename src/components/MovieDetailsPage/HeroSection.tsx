import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import {  HeroSectionProps } from "@/interfaces/interfaces_All";



const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  console.log(movie);
  return (
    <motion.div
      className="relative w-full h-96 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10"
        whileHover={{ opacity: 0.7 }}
      />
      <motion.img
        src={movie.image}
        alt={movie.title}
        className="w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10 }}
      />

      <div className="absolute bottom-0 left-0 z-20 w-full p-6">
        
        <div className="container mx-auto flex flex-col md:flex-row items-end gap-6">
          <motion.div
            className="w-32 h-48 bg-zinc-800 rounded-lg overflow-hidden shadow-xl"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div className="flex-1 text-white">
            {/* <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-green-600 hover:bg-green-700">{movie.rating}</Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                <span className="text-sm font-medium">{movie.score}</span>
              </div>
            </div> */}

            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>

            <div className="flex flex-wrap gap-2 mb-3">

                <Badge  variant="outline" className="border-zinc-600">
                  {movie.type}
                </Badge>
             
              {/* <Badge variant="outline" className="border-zinc-600 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {movie.duration}
              </Badge> */}
              {/* <Badge variant="outline" className="border-zinc-600">{movie.ageRating}</Badge> */}
              {/* <Badge variant="outline" className="border-zinc-600">{movie.language}</Badge> */}
            </div>

            {/* <p className="text-zinc-300 max-w-2xl mb-4">{movie.description}</p> */}

            {/* <div className="flex gap-3">
              <Button className="bg-red-600 hover:bg-red-700">Book Tickets</Button>
              <Button variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800">
                <Film className="mr-2 h-4 w-4" /> Trailer
              </Button>
            </div> */}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;