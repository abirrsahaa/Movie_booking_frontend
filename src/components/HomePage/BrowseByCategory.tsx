import { BrowseByCategoryProps } from "@/interfaces/interfaces_All"
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";

const BrowseByCategory: React.FC<BrowseByCategoryProps> = ({containerVariants,itemVariants}) => {
    return (
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
    )
}

export default BrowseByCategory;