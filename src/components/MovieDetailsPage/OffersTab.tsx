import {motion} from "framer-motion";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {  OffersTabProps } from "@/interfaces/interfaces_All";



const OffersTab:React.FC<OffersTabProps> = ({offers}) => {
    return (
        <TabsContent value="offers">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Available Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((offer, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-lg">{offer.title}</h3>
                    <Badge>{offer.code}</Badge>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 my-2">{offer.description}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">{offer.expiry}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    )
}

export default OffersTab;