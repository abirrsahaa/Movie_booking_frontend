
import { motion } from "framer-motion";
import { Button } from "../ui/button";
const AppDownload = () => {
    return (
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

    )
}

export default AppDownload;