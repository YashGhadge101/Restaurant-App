import { MenuItem } from "../types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeIn, cardVariants } from "../lib/motion";

interface AvailableMenuProps {
  menus: MenuItem[];
  isLoading?: boolean;
  navigateToCart?: boolean;
}

const AvailableMenu = ({ menus, isLoading = false, navigateToCart = true }: AvailableMenuProps) => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const handleAddToCart = (menu: MenuItem) => {
    addToCart(menu);
    toast.success(`${menu.name} added to cart!`);
    if (navigateToCart) {
      navigate("/cart");
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-4 relative">
        {menus.map((_, i) => (
          <div key={`placeholder-${i}`} className="opacity-0">
            <Card>
              <img src="/fallback-image.jpg" alt="placeholder" className="h-40 w-full object-cover" />
              <CardContent className="space-y-2">
                <h2 className="text-xl font-semibold">Placeholder</h2>
                <p className="text-sm">Placeholder description</p>
                <h3 className="text-lg font-semibold">Price: ₹0.00</h3>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          </div>
        ))}
        <motion.div
          className="absolute inset-0 grid md:grid-cols-3 gap-4"
          variants={staggerContainer()}
          initial="hidden"
          animate="show"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              variants={fadeIn('up', 'spring', i * 0.1, 0.5)}
            >
              <Card>
                <Skeleton className="h-40 w-full" />
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[180px]" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <p className="text-gray-500">No menus available</p>
      </motion.div>
    );
  }

  return (
    <div className="md:p-4">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xl md:text-2xl font-extrabold mb-6"
      >
        Available Menus
      </motion.h1>

      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {menus.map((menu, index) => (
            <motion.div
              key={menu._id}
              variants={cardVariants(index * 0.1)}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              layout
            >
              <Card className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                <motion.img
                  src={menu.image || '/fallback-image.jpg'}
                  alt={menu.name}
                  aria-label={`Image of ${menu.name}`}
                  className="w-full h-40 object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    console.error(`Failed to load image for ${menu.name}:`, e);
                    (e.target as HTMLImageElement).src = '/fallback-image.jpg';
                  }}
                />
                <CardContent className="p-4">
                  <motion.h2
                    className="text-xl font-semibold text-gray-800 dark:text-white"
                    whileHover={{ color: "#D19254" }}
                    transition={{ duration: 0.2 }}
                  >
                    {menu.name}
                  </motion.h2>
                  <motion.p
                    className="text-sm text-gray-600 mt-2 line-clamp-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {menu.description || "No description available"}
                  </motion.p>
                  <motion.h3
                    className="text-lg font-semibold mt-4"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Price: <span className="text-[#D19254]">₹{menu.price.toFixed(2)}</span>
                  </motion.h3>
                </CardContent>
                <CardFooter className="p-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleAddToCart(menu)}
                      className="w-full bg-orange hover:bg-hoverOrange"
                      aria-label={`Add ${menu.name} to cart`}
                    >
                      Add to Cart
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AvailableMenu;