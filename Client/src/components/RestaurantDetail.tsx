import { useRestaurantStore } from "../store/useRestaurantStore";
import AvailableMenu from "./AvailableMenu";
import { Badge } from "./ui/badge";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantDetail = () => {
  const { id } = useParams();
  const { singleRestaurant, getSingleRestaurant } = useRestaurantStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getSingleRestaurant(id).finally(() => setLoading(false));
    }
  }, [id, getSingleRestaurant]);

  if (loading) {
    return <div className="text-center my-10 text-lg font-semibold">Loading restaurant details...</div>;
  }

  if (!singleRestaurant) {
    return <div className="text-center my-10 text-lg font-semibold text-red-500">Restaurant not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="w-full">
        <div className="relative w-full h-32 md:h-64 lg:h-72">
          <img
            src={singleRestaurant.imageUrl || "/placeholder.jpg"}
            alt="Restaurant"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="my-5">
            <h1 className="font-medium text-xl">{singleRestaurant.restaurantName}</h1>
            <div className="flex gap-2 my-2">
              {singleRestaurant.cuisines.length > 0 ? (
                singleRestaurant.cuisines.map((cuisine, idx) => (
                  <Badge key={idx}>{cuisine}</Badge>
                ))
              ) : (
                <span className="text-gray-500">No cuisines available</span>
              )}
            </div>
            <div className="flex md:flex-row flex-col gap-2 my-5">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <h1 className="flex items-center gap-2 font-medium">
                  Delivery Time:{" "}
                  <span className="text-[#D19254]">
                    {singleRestaurant.deliveryTime ? `${singleRestaurant.deliveryTime} mins` : "NA"}
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        {singleRestaurant.menus && singleRestaurant.menus.length > 0 ? (
          <AvailableMenu menus={singleRestaurant.menus} />
        ) : (
          <p className="text-gray-500 text-center mt-5">No menu available.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
