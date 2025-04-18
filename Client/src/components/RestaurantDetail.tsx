import { useRestaurantStore } from "../store/useRestaurantStore";
import AvailableMenu from "./AvailableMenu";
import { Badge } from "./ui/badge";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import CreateMenu from "../components/menu/Createmenu";
import { toast } from "sonner";

const RestaurantDetail = () => {
  const params = useParams();
  const { singleRestaurant, getSingleRestaurant } = useRestaurantStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const isAdmin = true;

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      setError(null);
      await getSingleRestaurant(params.id!);
    } catch (err: any) {
      setError(err.message || "Failed to fetch restaurant details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [params.id]);

  const handleMenuCreated = async () => {
    await fetchRestaurant();
    toast("Menu created successfully!");
    setShowCreateMenu(false);
  };

  if (loading) {
    return (
      <motion.div className="max-w-6xl mx-auto my-10 space-y-4">
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

  if (error || !singleRestaurant) {
    return (
      <motion.div className="max-w-6xl mx-auto my-10">
        <p className="text-red-500">{error || "Restaurant not found"}</p>
      </motion.div>
    );
  }

  return (
    <motion.div className="max-w-6xl mx-auto my-10">
      <div className="relative w-full h-64">
        <img
          src={singleRestaurant.imageUrl}
          alt={singleRestaurant.restaurantName}
          className="object-contain w-full h-full rounded-lg shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/restaurant-fallback.jpg";
          }}
        />
      </div>

      <div className="my-5">
        <h1 className="font-medium text-xl">{singleRestaurant.restaurantName}</h1>
        <div className="flex gap-2 my-2 flex-wrap">
          <AnimatePresence>
            {singleRestaurant.cuisines.map((cuisine: string, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Badge>{cuisine}</Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex gap-2 my-5 items-center">
          <Timer className="w-5 h-5" />
          <h1 className="font-medium">
            Delivery Time: <span className="text-[#D19254]">{singleRestaurant.deliveryTime} mins</span>
          </h1>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <AvailableMenu menus={singleRestaurant.menus || []} />

        {isAdmin && (
          <div>
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              {showCreateMenu ? "Hide Create Menu" : "Add New Menu"}
            </button>

            {showCreateMenu && (
              <div className="mt-4">
                <CreateMenu
                  restaurantId={singleRestaurant._id}
                  onMenuCreated={handleMenuCreated} // ✅ Callback
                />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantDetail;
