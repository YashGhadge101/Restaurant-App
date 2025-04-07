import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Orders = () => {
  const { restaurantOrders, getRestaurantOrders, updateOrderStatus, loading } =
    useRestaurantStore();

  const handleStatusChange = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
  };

  useEffect(() => {
    getRestaurantOrders();
  }, [getRestaurantOrders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!restaurantOrders || restaurantOrders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          No Orders Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have any orders yet.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto py-10 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10">
        Orders Overview
      </h1>
      <div className="space-y-8">
        {restaurantOrders.map((order, index) => {
          const totalAmount =
            typeof order.totalAmount === "number"
              ? order.totalAmount / 100
              : 0;

          return (
            <motion.div
              key={order._id}
              className="flex flex-col md:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex-1 mb-6 sm:mb-0">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {order.deliveryDetails.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <span className="font-semibold">Address: </span>
                  {order.deliveryDetails.address}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <span className="font-semibold">Total Amount: </span>
                  {totalAmount}
                </p>
              </div>
              <div className="w-full sm:w-1/3">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Status
                </Label>
                <Select
                  onValueChange={(newStatus) =>
                    handleStatusChange(order._id, newStatus)
                  }
                  defaultValue={order.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[
                        "Pending",
                        "Confirmed",
                        "Preparing",
                        "OutForDelivery",
                        "Delivered",
                      ].map((status, i) => (
                        <SelectItem key={i} value={status.toLowerCase()}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Orders;
