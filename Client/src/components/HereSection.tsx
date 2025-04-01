import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Search, ChevronDown, Star, Clock, Utensils } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HereImage1 from "../assets/Panner-tikka.png";
import HereImage2 from "../assets/Momos.jpg";
import HereImage3 from "../assets/biryanii.jpg";
import HereImage4 from "../assets/Chole Bhature.jpg";
import HereImage5 from "../assets/Fish Curry.jpg";
import HereImage6 from "../assets/Burger.jpg";
import BackgroundImage from "../assets/BackgroundImage.jpg";

const images = [HereImage1, HereImage2, HereImage3, HereImage4, HereImage5, HereImage6];

// Sample food data
const popularDishes = [
  {
    id: 1,
    name: "Paneer Tikka",
    description: "Marinated cottage cheese grilled to perfection",
    rating: 4.8,
    prepTime: "25 mins",
    image: HereImage1
  },
  {
    id: 2,
    name: "Hyderabadi Biryani",
    description: "Fragrant basmati rice with tender meat and spices",
    rating: 4.9,
    prepTime: "45 mins",
    image: HereImage3
  },
  {
    id: 3,
    name: "Momos",
    description: "Steamed Tibetan dumplings with savory fillings",
    rating: 4.7,
    prepTime: "20 mins",
    image: HereImage2
  },
  {
    id: 4,
    name: "Chole Bhature",
    description: "Spicy chickpea curry with fried bread",
    rating: 4.6,
    prepTime: "30 mins",
    image: HereImage4
  }
];

const foodCategories = [
  { name: "Indian", icon: <Utensils className="w-6 h-6" /> },
  { name: "Chinese", icon: <Utensils className="w-6 h-6" /> },
  { name: "Italian", icon: <Utensils className="w-6 h-6" /> },
  { name: "Mexican", icon: <Utensils className="w-6 h-6" /> },
  { name: "Thai", icon: <Utensils className="w-6 h-6" /> },
  { name: "Japanese", icon: <Utensils className="w-6 h-6" /> }
];

const HereSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [textKey, setTextKey] = useState(0);

  const fullText = "Good Food, Great Moments, Right at Your Door!";
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
    <div className="relative">
      {/* Hero Section */}
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        {/* Overlay for Better Visibility */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20 relative z-10">
          {/* Left Section: Text and Search Input */}
          <div className="flex flex-col gap-10 md:w-[40%]">
            <div className="flex flex-col gap-5">
              {/* Animated Sentence */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={textKey}
                  className="font-extrabold md:text-5xl text-4xl text-white"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
                  }}
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
                      {index !== words.length - 1 && " "}
                    </motion.span>
                  ))}
                </motion.h1>
              </AnimatePresence>

              <p className="text-white text-lg">
                Hey! Our delicious food is waiting for you. We are always near to you.
              </p>
            </div>

            {/* Search Input Section */}
            <div className="relative flex items-center gap-2 w-full">
              <Search className="text-gray-400 absolute left-3 w-5 h-5" />
              <Input
                type="text"
                value={searchText}
                placeholder="Search restaurant by name, city & country"
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 shadow-lg focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out bg-white/70 backdrop-blur-md rounded-lg border border-gray-300 text-gray-900"
              />
              <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
                <Button 
                onClick={handleSearch}
                className="bg-white/30 hover:bg-white/50 text-white px-6 py-2 rounded-lg shadow-md">
                  <Search className="w-5 h-5" />
                  Search
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Right Section: Animated Hero Image */}
          <div className="relative w-[500px] h-[500px] overflow-hidden shadow-xl rounded-full border-4 border-white">
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

        {/* Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-10 h-10" />
        </motion.div>
      </div>

      {/* Additional Sections Below Hero */}
      <div className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        {/* Popular Dishes Section */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Popular Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDishes.map((dish) => (
              <motion.div 
                key={dish.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -5 }}
              >
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">{dish.name}</h3>
                  <p className="text-gray-600 mt-2">{dish.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="ml-1 text-gray-700">{dish.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="ml-1 text-gray-700">{dish.prepTime}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Food Categories Section */}
        <div className="max-w-7xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Explore Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {foodCategories.map((category, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-orange-50 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-orange-100 p-3 rounded-full mb-3">
                  {category.icon}
                </div>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-7xl mx-auto mt-20 bg-orange-50 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-orange-500">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Food</h3>
              <p className="text-gray-600">Browse our extensive menu and select your favorite dishes</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-orange-500">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
              <p className="text-gray-600">Add to cart and proceed to checkout with secure payment</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-orange-500">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your food delivered hot and fresh to your doorstep</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-7xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "The food was absolutely delicious! The biryani had the perfect blend of spices and the delivery was super fast."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Rahul Sharma</h4>
                    <p className="text-gray-500 text-sm">Regular Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to satisfy your cravings?</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Download our app now and get 20% off on your first order!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Download App
            </Button>
            <Button className="bg-transparent border-2 border-white text-white hover:bg-orange-700 px-8 py-4 text-lg font-semibold">
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HereSection;