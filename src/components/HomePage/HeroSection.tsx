import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  scrollY: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollY }) => {
  return (
    <section
      className="relative h-[600px] overflow-hidden"
      style={{
        backgroundImage: "url('https://th.bing.com/th/id/OIP.7aT2h0InAIIrDDSkHf2lwgHaEK?rs=1&pid=ImgDetMain')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Oppenheimer</h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-8">
            The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              Book Tickets
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Watch Trailer
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;