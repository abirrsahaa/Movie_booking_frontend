import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

// Types
interface Movie {
  id: number;
  title: string;
  image: string;
  type: string;
  isNew?: boolean;
}

interface PromoOffer {
  id: number;
  title: string;
  description: string;
  code?: string;
}

const HomePage = () => {
  // State for movies and upcoming movies
  const [nowShowing, setNowShowing] = useState<Movie[]>([
    { id: 1, title: 'Oppenheimer', image: '/movies/oppenheimer.jpg', type: 'IMAX', isNew: true },
    { id: 2, title: 'Barbie', image: '/movies/barbie.jpg', type: 'DOLBY', isNew: true },
    { id: 3, title: 'Mission Impossible', image: '/movies/mission.jpg', type: 'DIGITAL' },
    { id: 4, title: 'Ant Man', image: '/movies/antman.jpg', type: 'IMAX', isNew: true },
    { id: 5, title: 'John Wick', image: '/movies/johnwick.jpg', type: 'DOLBY', isNew: true },
  ]);

  const [comingSoon, setComingSoon] = useState<Movie[]>([
    { id: 6, title: 'Deadpool 3', image: '/movies/deadpool3.jpg', type: 'IMAX' },
    { id: 7, title: 'Dune 2', image: '/movies/dune2.jpg', type: 'DOLBY' },
    { id: 8, title: 'Fast X', image: '/movies/fastx.jpg', type: 'DIGITAL' },
    { id: 9, title: 'The Marvels', image: '/movies/marvels.jpg', type: 'IMAX' },
  ]);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  // Parallax effect for the hero section
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const aesehi=async ()=>{
      const getting=await axios.get("http://localhost:9090/hello");
      console.log(getting.data);
    }
    aesehi();
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Parallax */}
      <section 
        className="relative h-[500px] overflow-hidden"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Latest Movie Banner</h1>
            <p className="text-xl text-gray-200 mb-8">Experience the magic of cinema with our premium booking experience</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">Book Tickets</Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">Watch Trailer</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Now Showing Movies */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold dark:text-white">Now Showing</h2>
          <Button variant="ghost" className="text-sm">View All</Button>
        </div>

        <motion.div 
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.2 }} // Trigger animation every time the element is in view
  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
>
  {nowShowing.map((movie) => (
    <motion.div key={movie.id} variants={itemVariants}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg group dark:bg-gray-800">
        <div className="relative aspect-[2/3] bg-gray-100 dark:bg-gray-700">
          {movie.isNew && (
            <Badge className="absolute top-2 right-2 bg-yellow-400 text-black">NEW</Badge>
          )}
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {movie.title}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold dark:text-white">{movie.title}</h3>
            <Badge variant="outline" className="text-xs">{movie.type}</Badge>
          </div>
          <div className="mt-4">
            <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">Book</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</motion.div>
      </section>

      {/* Coming Soon */}
      <section className="py-12 container mx-auto px-4 bg-gray-100 dark:bg-gray-800/50">
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-bold dark:text-white">Coming Soon</h2>
    <Button variant="ghost" className="text-sm">View All</Button>
  </div>

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
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {movie.title}
            </div>
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
</section>
      {/* Browse by Category */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 dark:text-white">Browse by Category</h2>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-purple-500 text-white h-32 hover:bg-purple-600 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 8h7" /><path d="M8 12h6" /><path d="M11 16h5" /></svg>
                <span className="font-medium">Drama</span>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-green-500 text-white h-32 hover:bg-green-600 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M7.5 4.27 9 6c5.5-2.5 9.5 4.5 7 10 2.5-5.5-4.5-9.5-10-7l-1.73-1.53a3 3 0 0 1 .69-4.92A3 3 0 0 1 7.5 4.27Z" /><path d="m2 2 20 20" /><path d="M8.35 8.35a3 3 0 0 0 4.3 4.3" /></svg>
                <span className="font-medium">Comedy</span>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-rose-500 text-white h-32 hover:bg-rose-600 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M6 12h12" /><path d="M12 18V6" /></svg>
                <span className="font-medium">Horror</span>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-amber-500 text-white h-32 hover:bg-amber-600 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" /></svg>
                <span className="font-medium">Action</span>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Offers and Promotions */}
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
      </section>

      {/* Quick Links */}
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
              <TabsTrigger value="current">Current Movies</TabsTrigger>
              <TabsTrigger value="latest">Latest Releases</TabsTrigger>
              <TabsTrigger value="theaters">Movie Theaters</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Movies</TabsTrigger>
              <TabsTrigger value="gift">Gift Cards</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300">Find all the currently playing movies across theaters in your city.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="latest" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300">Explore the newest movie releases this week.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="theaters" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300">Find theaters near you with IMAX, Dolby, and other premium formats.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="upcoming" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300">Get a sneak peek at movies coming soon to theaters.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="gift" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300">Give the gift of movies with our digital gift cards.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="offers" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300">Find all current promotions and special deals for movie tickets.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </section>

      {/* App Download Section */}
      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.2 }}
            className="bg-gray-900 text-white p-8 rounded-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Download the MovieMagic App</h2>
            <p className="mb-6">Book tickets faster, get exclusive offers and more</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.954 11.616 15.95 8.8c.17-.163.17-.43 0-.594l-1.066-1.086a.39.39 0 0 0-.566 0L9.583 11.61a.398.398 0 0 0-.117.282c0 .104.042.208.117.282l4.735 4.754a.39.39 0 0 0 .566 0l1.066-1.086a.422.422 0 0 0 0-.594l-2.996-2.815a.397.397 0 0 1 0-.535z" fill="currentColor"/>
                </svg>
                App Store
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6.812a3.25 3.25 0 0 1 1.043-2.387l.03-.026c.59-.573 1.453-.9 2.37-.9.476 0 .929.084 1.339.234l.31.115c.338.137.724.137 1.062 0l.345-.127c.396-.141.832-.222 1.292-.222.917 0 1.78.327 2.37.901l.03.026A3.25 3.25 0 0 1 14 6.813v10.375a3.25 3.25 0 0 1-1.042 2.386l-.03.027c-.59.573-1.454.899-2.37.899-.476 0-.93-.083-1.34-.233l-.309-.115a1.371 1.371 0 0 0-1.062 0l-.345.127c-.396.14-.832.221-1.292.221-.917 0-1.78-.326-2.37-.9l-.03-.026A3.25 3.25 0 0 1 3 17.188V6.812z" fill="currentColor"/>
                </svg>
                Google Play
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.2 }}
            className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg flex items-center justify-center"
          >
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Mobile App Screenshot</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Movies</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Now Showing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Coming Soon</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Most Popular</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Top Rated</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Theaters</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">IMAX</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dolby Cinema</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">4DX</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Find Nearby</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">My Profile</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">My Bookings</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Notifications</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Preferences</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 MovieMagic. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.39 4.482A13.978 13.978 0 0 1 1.671 3.149a4.93 4.93 0 0 0 1.523 6.574 4.903 4.903 0 0 1-2.229-.616v.061a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.224.084 4.917 4.917 0 0 0 4.6 3.415 9.868 9.868 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.054 0 14-7.497 14-13.986 0-.21 0-.42-.015-.63A9.936 9.936 0 0 0 24 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
              <svg
  className="h-6 w-6"
  fill="currentColor"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  aria-label="Facebook"
  role="img"
>
  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0" />
</svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
};

export default HomePage;