import { Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { cart, decrementQuantity, incrementQuantity, removeFromTheCart, clearCart } =
    useCartStore();

  const totalAmount = cart
    .reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10">
      <div className="flex justify-end">
        <Button
          onClick={clearCart}
          className="text-red-500 hover:text-red-600 transition-all duration-300"
        >
          Clear All
        </Button>
      </div>

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
          {cart.map((item: CartItem) => (
            <TableRow
              key={item._id}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <TableCell>
                <Avatar>
                  <AvatarImage src={item.image} alt={item.name} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>₹{item.price.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2">
                  <Button
                    onClick={() => decrementQuantity(item._id)}
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-gray-200 hover:scale-110 transition-all duration-300"
                  >
                    <Minus />
                  </Button>
                  <span className="font-bold">{item.quantity}</span>
                  <Button
                    onClick={() => incrementQuantity(item._id)}
                    size="icon"
                    className="rounded-full bg-orange hover:bg-hoverOrange hover:scale-110 transition-all duration-300"
                    variant="outline"
                  >
                    <Plus />
                  </Button>
                </div>
              </TableCell>
              <TableCell>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => removeFromTheCart(item._id)}
                  size="sm"
                  className="bg-orange hover:bg-hoverOrange transition-all duration-300 hover:scale-105"
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="text-2xl font-bold">
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">₹{totalAmount}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="flex justify-end my-5">
        <Button
          onClick={() => setOpen(true)}
          className="bg-orange hover:bg-hoverOrange transition-all duration-300 hover:scale-105"
        >
          Proceed To Checkout
        </Button>
      </div>

      <CheckoutConfirmPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;
