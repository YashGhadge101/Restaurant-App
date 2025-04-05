// Restaurant.tsx

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
  const [restaurantMenus, setRestaurantMenus] = useState<MenuItem[] | null>(null);

  const {
    loading,
    restaurants,
    updateRestaurant,
    createRestaurant,
    getRestaurants,
    getSingleRestaurant,
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
        setRestaurantMenus(null);
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

  const editRestaurant = async (restaurant: RestaurantType) => {
    setEditRestaurantId(restaurant._id);
    const response = await getSingleRestaurant(restaurant._id);
    setRestaurantMenus(response?.menus || null);
    setInput({
      restaurantName: restaurant.restaurantName || "",
      city: restaurant.city || "",
      country: restaurant.country || "",
      deliveryTime: restaurant.deliveryTime || 0,
      cuisines: restaurant.cuisines || [],
      imageFile: undefined,
    });
  };

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div>
        <div>
          <h1 className="font-extrabold text-2xl mb-5">Add Restaurants</h1>
          <form onSubmit={submitHandler}>
            <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
            </div>
            <div className="my-5 w-fit">
              {loading ? (
                <Button disabled className="bg-orange hover:bg-hoverOrange">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button className="bg-orange hover:bg-hoverOrange">
                  {editRestaurantId ? "Update Restaurant" : "Add Restaurant"}
                </Button>
              )}
            </div>
          </form>

          <div>
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="border p-4 my-4">
                <p>Name: {restaurant.restaurantName}</p>
                <p>City: {restaurant.city}</p>
                <Button onClick={() => editRestaurant(restaurant)}>Edit</Button>
                {editRestaurantId === restaurant._id && restaurantMenus && (
                  <div>
                    <h3>Menus:</h3>
                    <ul>
                      {restaurantMenus.map((menu) => (
                        <li key={menu._id}>
                          {menu.name} - ${menu.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;