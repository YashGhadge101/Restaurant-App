import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HereImage1 from "../assets/hero_pizza.png";
import HereImage2 from "../assets/IceCream.jpg";
import HereImage3 from "../assets/Naan.jpg";
import HereImage4 from "../assets/Noodles.jpg";
import HereImage5 from "../assets/Pasta.jpg";
import HereImage6 from "../assets/Smothie.jpg";

const images = [HereImage1, HereImage2, HereImage3, HereImage4, HereImage5, HereImage6];

const HereSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [textKey, setTextKey] = useState(0); // Key to restart text animation

  const fullText = "From our kitchen to your doorstep – fresh and fast!";
  const words = fullText.split(" ");

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    const textInterval = setInterval(() => {
      setTextKey((prevKey) => prevKey + 1);
    }, 5000);

    return () => {
      clearInterval(imageInterval);
      clearInterval(textInterval);
    };
  }, []);

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search/${searchText}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20">
      {/* Left Section: Text and Search Input */}
      <div className="flex flex-col gap-10 md:w-[40%]">
        <div className="flex flex-col gap-5">
          {/* Animated Sentence (Repeats every 5s) */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={textKey} // Key changes every 5s, forcing re-animation
              className="font-bold md:font-extrabold md:text-5xl text-4xl text-orange-600 flex flex-wrap gap-2"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } },}}
            >
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.8 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </AnimatePresence>

          <p className="text-gray-500">
            Hey! Our delicious food is waiting for you, we are always near to you.
          </p>
        </div>

        {/* Search Input Section */}
        <div className="relative flex items-center gap-2 w-full">
          <Search className="text-gray-500 absolute left-3 w-5 h-5" />

          <Input
            type="text"
            value={searchText}
            placeholder="Search restaurant by name, city & country"
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 shadow-lg focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out hover:ring-2 hover:ring-orange-400 hover:shadow-xl"
            aria-label="Search restaurants"
          />

          {/* Animated Search Button */}
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Button
              onClick={handleSearch}
              className="bg-orange hover:bg-hoverOrange transition-all duration-300 flex items-center gap-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
              Search
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Right Section: Animated Hero Image */}
      <div className="relative w-[500px] h-[500px] overflow-hidden rounded-full shadow-xl border-4 border-gray-200">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt="Delicious food displayed"
          className="absolute w-full h-full object-cover rounded-full"
          initial={{ scale: 0.8, x: "100%", opacity: 0 }}
          animate={{ scale: 1, x: "0%", opacity: 1 }}
          exit={{ scale: 0.8, x: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default HereSection;
