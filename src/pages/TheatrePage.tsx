import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import _ from "lodash";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Clock, MapPin, Ticket, Search, Filter } from "lucide-react";

const TheaterSelection: React.FC = () => {
  interface Showtime {
    id: number;
    time: string;
    price: number;
  }
  
  interface Cinema {
    id: number;
    name: string;
    distance: string;
    showtimes: Showtime[];
    backgroundImage?: string;
  }

  const theatreBackgrounds = [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW92aWUlMjB0aGVhdGVyfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1635400138431-0bbde4d01484?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1vdmllJTIwdGhlYXRlcnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1604975701397-6365ccbd028a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1vdmllJTIwdGhlYXRlcnxlbnwwfHwwfHx8MA%3D%3D",   
    "https://plus.unsplash.com/premium_photo-1664303124313-126bf7456982?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW92aWUlMjB0aGVhdGVyfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW92aWUlMjB0aGVhdGVyfGVufDB8fDB8fHww"
  ];
  
  const cinemas: Cinema[] = [
    {
      id: 1,
      name: "INOX: Prozone Mall",
      distance: "5.2 km",
      backgroundImage: theatreBackgrounds[0],
      showtimes: [
        { id: 1, time: "10:15 AM", price: 200 },
        { id: 2, time: "1:30 PM", price: 200 },
        { id: 3, time: "4:45 PM", price: 250 },
        { id: 4, time: "8:00 PM", price: 250 },
        { id: 5, time: "10:30 PM", price: 250 },
      ]
    },
    {
      id: 2,
      name: "PVR: Cinemas",
      distance: "3.8 km",
      backgroundImage: theatreBackgrounds[1],
      showtimes: [
        { id: 6, time: "11:30 AM", price: 230 },
        { id: 7, time: "2:45 PM", price: 230 },
        { id: 8, time: "6:00 PM", price: 280 },
        { id: 9, time: "9:15 PM", price: 240 },
      ]
    },
    {
      id: 3,
      name: "Cinepolis: Forum Mall",
      distance: "7.1 km",
      backgroundImage: theatreBackgrounds[2],
      showtimes: [
        { id: 10, time: "12:30 PM", price: 220 },
        { id: 11, time: "3:45 PM", price: 220 },
        { id: 12, time: "7:15 PM", price: 290 },
        { id: 13, time: "10:45 PM", price: 290 },
      ]
    },
  ];

  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [distanceFilter, setDistanceFilter] = useState<'all' | 'near' | 'far'>('all');

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => _.debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Filtered and searched cinemas
  const filteredCinemas = useMemo(() => {
    return cinemas.filter(cinema => {
      // Search filter
      const matchesSearch = cinema.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Distance filter
      const distance = parseFloat(cinema.distance);
      const matchesDistance = 
        distanceFilter === 'all' || 
        (distanceFilter === 'near' && distance <= 4) || 
        (distanceFilter === 'far' && distance > 4);

      return matchesSearch && matchesDistance;
    });
  }, [searchTerm, distanceFilter]);

  const handleCinemaSelect = (cinema: Cinema) => {
    setSelectedCinema(cinema);
    setSelectedShowtime(null);
  };

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{
            repeat: Infinity,
            duration: 5,
            repeatType: "mirror",
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${selectedCinema?.backgroundImage || theatreBackgrounds[0]})`,
            filter: "blur(5px)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Search theaters..."
                onChange={handleSearchChange}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white/80"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <div className="flex space-x-2">
                <Button 
                  variant={distanceFilter === 'all' ? 'default' : 'outline'} 
                  onClick={() => setDistanceFilter('all')}
                  className="flex items-center"
                >
                  <Filter size={16} className="mr-2" /> All
                </Button>
                <Button 
                  variant={distanceFilter === 'near' ? 'default' : 'outline'} 
                  onClick={() => setDistanceFilter('near')}
                  className="flex items-center"
                >
                  <MapPin size={16} className="mr-2" /> Near (≤4 km)
                </Button>
                <Button 
                  variant={distanceFilter === 'far' ? 'default' : 'outline'} 
                  onClick={() => setDistanceFilter('far')}
                  className="flex items-center"
                >
                  <MapPin size={16} className="mr-2" /> Far (4 km)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Theaters Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCinemas.map((cinema) => (
            <motion.div
              key={cinema.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 300 },
                },
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
              }}
              className="perspective-1000"
            >
              <Card
                className={`overflow-hidden transition-all duration-300 rounded-xl border-0 ${
                  selectedCinema?.id === cinema.id
                    ? "ring-4 ring-primary/50"
                    : "hover:shadow-2xl"
                }`}
                onClick={() => handleCinemaSelect(cinema)}
              >
                {/* Background Image */}
                <div
                  className="relative aspect-[16/9] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${cinema.backgroundImage})`,
                    filter: "grayscale(80%) blur(2px)",
                  }}
                />

                {/* Content Overlay */}
                <CardContent className="relative z-10 p-6 bg-white/80 backdrop-blur-sm">
                  <div className="relative z-20">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{cinema.name}</h3>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin size={16} className="mr-2" />
                        <span className="font-medium">{cinema.distance}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>{cinema.showtimes.length} Shows</span>
                      </div>
                      <div className="flex items-center text-primary font-semibold">
                        <Ticket size={16} className="mr-2" />
                        <span>From ₹{Math.min(...cinema.showtimes.map((s) => s.price))}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Show a message if no cinemas match the filter */}
        {filteredCinemas.length === 0 && (
          <div className="text-center py-8 bg-white/90 rounded-xl mt-6">
            <p className="text-gray-600 text-lg">
              No theaters found matching your search or filter criteria.
            </p>
          </div>
        )}

        {/* Showtime Selection */}
        <AnimatePresence>
          {selectedCinema && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Ticket className="mr-3 text-primary" />
                Showtimes at {selectedCinema.name}
              </h2>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delayChildren: 0.2,
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {selectedCinema.showtimes.map((showtime) => (
                  <motion.div
                    key={showtime.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Button
                      variant={selectedShowtime?.id === showtime.id ? "default" : "outline"}
                      onClick={() => handleShowtimeSelect(showtime)}
                      className="w-full flex justify-between items-center rounded-lg"
                    >
                      <span>{showtime.time}</span>
                      <span className="text-sm font-semibold">₹{showtime.price}</span>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Proceed Button */}
        {/* <AnimatePresence>
          {selectedShowtime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-8 text-center"
            >
              <Button
                size="lg"
                className="w-full max-w-md mx-auto group bg-primary hover:bg-primary-700 text-white"
              >
                Proceed to Seat Selection
                <ChevronRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </motion.div>
          )}
        </AnimatePresence> */}
      </div>
    </div>
  );
};

export default TheaterSelection;