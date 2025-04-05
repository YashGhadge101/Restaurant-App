import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "../store/useOrderStore";
import { useEffect } from "react";
import { CartItem } from "../types/cartType";
import { motion, AnimatePresence } from "framer-motion";

const Success = () => {
  const { orders, getOrderDetails } = useOrderStore();

  useEffect(() => {
    getOrderDetails();
  }, []);

  if (orders.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">Order not found!</h1>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4"
    >
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Order Status: <span className="text-[#FF5A5A]">CONFIRMED</span>
          </h1>
        </motion.div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Order Summary</h2>
          <AnimatePresence>
            {orders.map((order: any, index: number) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                {order.cartItems.map((item: CartItem, itemIdx: number) => (
                  <motion.div key={itemIdx} className="mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: itemIdx * 0.05 }}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
                        <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">{item.name}</h3>
                      </div>
                      <div className="text-right flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{item.price}</span>
                      </div>
                    </div>
                    <Separator className="my-4" />
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <Link to="/cart">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">Continue Shopping</Button>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Success;