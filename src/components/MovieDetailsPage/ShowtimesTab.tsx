import {  Calendar, ChevronRight, Info, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TabsContent } from "../ui/tabs";
import {motion} from "framer-motion";
import { useState } from "react";
import {  ShowtimesTabProps } from "@/interfaces/interfaces_All";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";


const ShowtimesTab:React.FC<ShowtimesTabProps> = ({dates,cinemas,slideUp,staggerChildren,onShowtimeSelect}) => {

        const [selectedDate, setSelectedDate] = useState(
            `${dates[0].day} ${dates[0].date} ${dates[0].month}`
          );
   
        
    return (
        <TabsContent value="showtimes" className="space-y-6">
        {/* Date Selection */}
        <div className="flex items-center gap-4 mb-4">
          <Select onValueChange={(value) => setSelectedDate(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Date" />
              <Calendar className="w-4 h-4 ml-2" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((date, i) => (
                <SelectItem key={i} value={`${date.day} ${date.date} ${date.month}`}>
                  {date.day}, {date.date} {date.month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cinemas List */}
        <motion.div
          className="space-y-6"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {cinemas.map((cinema, i) => (
            <motion.div
              key={i}
              variants={slideUp}
              whileHover={{ y: -2 }}
              className="rounded-lg overflow-hidden"
            >
              <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
                <CardContent className="p-0">
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-start gap-2">
                        <h3 className="text-lg font-medium">{cinema.name}</h3>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        >
                          SAFE
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                        <MapPin className="w-3 h-3 mr-1" />
                         • {cinema.distance}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                      <Info className="w-4 h-4 mr-1" /> Info
                    </Button>
                  </div>
                  <Separator className="my-2" />
                  <div className="p-4 flex flex-wrap gap-2">
                    {cinema.showtimes.map((showtime, j) => (
                      <Button
                        key={j}
                        variant="outline"
                        className="text-sm border-zinc-300 dark:border-zinc-700"
                        onClick={() => onShowtimeSelect(cinema, showtime)}
                      >
                        <ChevronRight className="w-4 h-4 mr-1" />
                        {showtime.time}  - {showtime.price}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </TabsContent>
    )
}
export default ShowtimesTab;