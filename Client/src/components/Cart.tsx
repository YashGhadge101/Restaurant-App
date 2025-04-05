import { Minus, Plus } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import CheckoutConfirmPage from "./CheckoutConfirmPage";
import { useCartStore } from "../store/useCartStore";
import { CartItem } from "../types/cartType";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeIn } from "../lib/motion";

const MotionButton = motion(Button); // Create a motion version of your Button

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { cart, decrementQuantity, incrementQuantity, removeFromTheCart, clearCart } =
    useCartStore();

  const totalAmount = cart
    .reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col max-w-7xl mx-auto my-10"
    >
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end"
      >
        <MotionButton // Use MotionButton instead of Button
          onClick={clearCart}
          className="text-red-500 hover:text-red-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear All
        </MotionButton>
      </motion.div>

      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200 dark:bg-gray-700">
              <TableHead>Items</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {cart.map((item: CartItem, index: number) => (
                <motion.tr
                  key={item._id}
                  variants={fadeIn('right', 'spring', index * 0.05, 0.5)}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, x: -50 }}
                  layout
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <TableCell>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Avatar>
                        <AvatarImage src={item.image} alt={item.name} />
                      </Avatar>
                    </motion.div>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <motion.div
                      className="flex items-center gap-2 border border-gray-300 rounded-lg px-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <MotionButton // Use MotionButton instead of Button
                        onClick={() => decrementQuantity(item._id)}
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-gray-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus />
                      </MotionButton>
                      <motion.span
                        className="font-bold"
                        key={item.quantity}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        {item.quantity}
                      </motion.span>
                      <MotionButton // Use MotionButton instead of Button
                        onClick={() => incrementQuantity(item._id)}
                        size="icon"
                        className="rounded-full bg-orange hover:bg-hoverOrange"
                        variant="outline"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus />
                      </MotionButton>
                    </motion.div>
                  </TableCell>
                  <TableCell>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MotionButton // Use MotionButton instead of Button
                        onClick={() => removeFromTheCart(item._id)}
                        size="sm"
                        className="bg-orange hover:bg-hoverOrange"
                      >
                        Remove
                      </MotionButton>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
          <TableFooter>
            <TableRow className="text-2xl font-bold">
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-right">
                <motion.div
                  key={totalAmount}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  ₹{totalAmount}
                </motion.div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end my-5"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MotionButton // Use MotionButton instead of Button
            onClick={() => setOpen(true)}
            className="bg-orange hover:bg-hoverOrange"
          >
            Proceed To Checkout
          </MotionButton>
        </motion.div>
      </motion.div>

      <CheckoutConfirmPage open={open} setOpen={setOpen} />
    </motion.div>
  );
};

export default Cart;