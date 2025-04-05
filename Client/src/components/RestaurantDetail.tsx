import { useRestaurantStore } from "../store/useRestaurantStore";
import AvailableMenu from "./AvailableMenu";
import { Badge } from "./ui/badge";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const RestaurantDetail = () => {
  const params = useParams();
  const { singleRestaurant, getSingleRestaurant, getRestaurantMenus } = useRestaurantStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getSingleRestaurant(params.id!);
        await getRestaurantMenus(params.id!);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto my-10 space-y-4"
      >
        <Skeleton className="w-full h-64 rounded-lg" />
        <Skeleton className="w-1/2 h-8" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-20 h-6" />
          ))}
        </div>
        <Skeleton className="w-1/3 h-6" />
      </motion.div>
    );
  }

  if (!singleRestaurant) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto my-10"
      >
        Restaurant not found
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto my-10"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} // Initial scale slightly smaller
        animate={{ opacity: 1, scale: 1 }} // Animate to normal scale
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // smooth transition
        className="w-full"
      >
        <div className="relative w-full h-32 md:h-64 lg:h-72">
          <img
            src={singleRestaurant.imageUrl}
            alt={singleRestaurant.restaurantName}
            className="object-cover w-full h-full rounded-lg shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/restaurant-fallback.jpg';
            }}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="my-5"
          >
            <h1 className="font-medium text-xl">{singleRestaurant.restaurantName}</h1>
            <div className="flex gap-2 my-2 flex-wrap">
              <AnimatePresence>
                {singleRestaurant.cuisines.map((cuisine: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Badge>{cuisine}</Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex md:flex-row flex-col gap-2 my-5">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <h1 className="flex items-center gap-2 font-medium">
                  Delivery Time: <span className="text-[#D19254]">{singleRestaurant.deliveryTime} mins</span>
                </h1>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <AvailableMenu menus={singleRestaurant.menus || []} />
    </motion.div>
  );
};

export default RestaurantDetail;