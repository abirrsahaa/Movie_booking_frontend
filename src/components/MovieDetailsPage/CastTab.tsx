import { CastTabProps } from "@/interfaces/interfaces_All";
import { Card, CardContent } from "../ui/card";
import { TabsContent } from "../ui/tabs";
import {motion} from "framer-motion";


const CastTab:React.FC<CastTabProps> = ({ movie }) => {

    return (
        <TabsContent value="cast">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Cast & Crew</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.cast.map((actor, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-2">
                    <img
                      src="/api/placeholder/150/200"
                      alt={actor}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">{actor}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Actor</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    )
}
export default CastTab;