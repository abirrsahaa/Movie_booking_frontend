import { TabsSectionProps } from "@/interfaces/interfaces_All";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ShowtimesTab from "./ShowtimesTab";
import AboutTab from "./AboutTab";
import CastTab from "./CastTab";
import ReviewsTab from "./ReviewsTab";
import OffersTab from "./OffersTab";



const TabsSection: React.FC<TabsSectionProps> = ({ movie, dates, cinemas, reviews, offers, onShowtimeSelect,staggerChildren,slideUp }) => {
    return (
      <Tabs defaultValue="showtimes" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="showtimes" className="text-sm md:text-base">Showtimes</TabsTrigger>
          <TabsTrigger value="about" className="text-sm md:text-base">About</TabsTrigger>
          <TabsTrigger value="cast" className="text-sm md:text-base">Cast & Crew</TabsTrigger>
          <TabsTrigger value="reviews" className="text-sm md:text-base">Reviews</TabsTrigger>
          <TabsTrigger value="offers" className="text-sm md:text-base">Offers</TabsTrigger>
        </TabsList>
  
        <TabsContent value="showtimes">
          <ShowtimesTab dates={dates} cinemas={cinemas} onShowtimeSelect={onShowtimeSelect} staggerChildren={staggerChildren} slideUp={slideUp}/>
        </TabsContent>
        <TabsContent value="about">
          <AboutTab movie={movie} />
        </TabsContent>
        <TabsContent value="cast">
          <CastTab movie={movie} />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewsTab reviews={reviews} />
        </TabsContent>
        <TabsContent value="offers">
          <OffersTab offers={offers} />
        </TabsContent>
      </Tabs>
    );
  };
export default TabsSection;