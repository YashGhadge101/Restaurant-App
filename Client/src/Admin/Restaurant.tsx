import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  RestaurantFormSchema,
  restaurantFromSchema,
} from "../Schema/restaurantSchema";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Restaurant as RestaurantType, MenuItem } from "../types/restaurantType";
import { motion, AnimatePresence } from "framer-motion";

const Restaurant = () => {
  const [input, setInput] = useState<RestaurantFormSchema>({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: 0,
    cuisines: [],
    imageFile: undefined,
  });
  const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({});
  const [editRestaurantId, setEditRestaurantId] = useState<string | null>(null);
  const [restaurantMenusMap, setRestaurantMenusMap] = useState<
    Record<string, MenuItem[]>
  >({});

  const {
    loading,
    restaurants,
    updateRestaurant,
    createRestaurant,
    getRestaurants,
    getSingleRestaurant,
    getRestaurantMenus,
  } = useRestaurantStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = restaurantFromSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<RestaurantFormSchema>);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("restaurantName", input.restaurantName);
      formData.append("city", input.city);
      formData.append("country", input.country);
      formData.append("deliveryTime", input.deliveryTime.toString());
      formData.append("cuisines", JSON.stringify(input.cuisines));
      if (input.imageFile) {
        formData.append("imageFile", input.imageFile);
      }

      if (editRestaurantId) {
        formData.append("restaurantId", editRestaurantId);
        await updateRestaurant(formData);
        setEditRestaurantId(null);
      } else {
        await createRestaurant(formData);
      }

      setInput({
        restaurantName: "",
        city: "",
        country: "",
        deliveryTime: 0,
        cuisines: [],
        imageFile: undefined,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      const menusMap: Record<string, MenuItem[]> = {};
      for (const restaurant of restaurants) {
        const menus = await getRestaurantMenus(restaurant._id);
        if (menus) {
          menusMap[restaurant._id] = menus;
        }
      }
      setRestaurantMenusMap(menusMap);
    };

    if (restaurants.length > 0) {
      fetchMenus();
    }
  }, [restaurants, getRestaurantMenus]);

  const editRestaurant = async (restaurant: RestaurantType) => {
    setEditRestaurantId(restaurant._id);
    const response = await getSingleRestaurant(restaurant._id);
    setRestaurantMenusMap({ [restaurant._id]: response?.menus || [] });
    setInput({
      restaurantName: restaurant.restaurantName || "",
      city: restaurant.city || "",
      country: restaurant.country || "",
      deliveryTime: restaurant.deliveryTime || 0,
      cuisines: restaurant.cuisines || [],
      imageFile: undefined,
    });
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto my-10"
    >
      <div>
        <div>
          <h1 className="font-extrabold text-2xl mb-5">Add Restaurants</h1>
          <form onSubmit={submitHandler}>
            <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
              <motion.div
                custom={0}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Label>Restaurant Name</Label>
                <Input
                  type="text"
                  name="restaurantName"
                  value={input.restaurantName}
                  onChange={changeEventHandler}
                  placeholder="Enter your restaurant name"
                />
                {errors && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.restaurantName}
                  </span>
                )}
              </motion.div>
              <motion.div
                custom={1}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  value={input.city}
                  onChange={changeEventHandler}
                  placeholder="Enter your city name"
                />
                {errors && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.city}
                  </span>
                )}
              </motion.div>
              <motion.div
                custom={2}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Label>Country</Label>
                <Input
                  type="text"
                  name="country"
                  value={input.country}
                  onChange={changeEventHandler}
                  placeholder="Enter your country name"
                />
                {errors && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.country}
                  </span>
                )}
              </motion.div>
              <motion.div
                custom={3}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Label>Delivery Time</Label>
                <Input
                  type="number"
                  name="deliveryTime"
                  value={input.deliveryTime}
                  onChange={changeEventHandler}
                  placeholder="Enter your delivery time"
                />
                {errors && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.deliveryTime}
                  </span>
                )}
              </motion.div>
              <motion.div
                custom={4}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Label>Cuisines</Label>
                <Input
                  type="text"
                  name="cuisines"
                  value={input.cuisines}
                  onChange={(e) =>
                    setInput({ ...input, cuisines: e.target.value.split(",") })
                  }
                  placeholder="e.g. Momos, Biryani"
                />
                {errors && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.cuisines}
                  </span>
                )}
              </motion.div>
              <motion.div
                custom={5}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Label>Upload Restaurant Banner</Label>
                <Input
                  onChange={(e) =>
                    setInput({
                      ...input,
                      imageFile: e.target.files?.[0] || undefined,
                    })
                  }
                  type="file"
                  accept="image/*"
                  name="imageFile"
                />
                {errors && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.imageFile?.name}
                  </span>
                )}
              </motion.div>
            </div>
            <div className="my-5 w-fit">
              {loading ? (
                <Button disabled className="bg-orange hover:bg-hoverOrange">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-orange hover:bg-hoverOrange">
                    {editRestaurantId ? "Update Restaurant" : "Add Restaurant"}
                  </Button>
                </motion.div>
              )}
            </div>
          </form>

          <div>
            <AnimatePresence>
              {restaurants.map((restaurant) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border p-4 my-4"
                >
                  <p>Name: {restaurant.restaurantName}</p>
                  <p>City: {restaurant.city}</p>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button onClick={() => editRestaurant(restaurant)}>Edit</Button>
                  </motion.div>
                  {restaurantMenusMap[restaurant._id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3>Menus:</h3>
                      <ul>
                        {restaurantMenusMap[restaurant._id].map((menu) => (
                          <li key={menu._id}>
                            {menu.name} - ${menu.price}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Restaurant;