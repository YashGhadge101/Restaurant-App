import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RestaurantFormSchema, restaurantFromSchema } from "../Schema/restaurantSchema";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

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

  const {
    loading,
    restaurant,
    updateRestaurant,
    createRestaurant,
    getRestaurant,
  } = useRestaurantStore();

  useEffect(() => {
    const fetchRestaurant = async () => {
      await getRestaurant();
    };
    fetchRestaurant();
  }, []);

  useEffect(() => {
    if (restaurant) {
      setInput({
        restaurantName: restaurant.restaurantName || "",
        city: restaurant.city || "",
        country: restaurant.country || "",
        deliveryTime: restaurant.deliveryTime || 0,
        cuisines: restaurant.cuisines ? [...restaurant.cuisines] : [],
        imageFile: undefined,
      });
    }
  }, [restaurant]);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = restaurantFromSchema.safeParse(input);
    if (!result.success) {
      setErrors(result.error.formErrors.fieldErrors as Partial<RestaurantFormSchema>);
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

      if (restaurant) {
        await updateRestaurant(formData);
      } else {
        await createRestaurant(formData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div>
        <h1 className="font-extrabold text-2xl mb-5">
          {restaurant ? "Update Your Restaurant" : "Add Restaurants"}
        </h1>
        <form onSubmit={submitHandler}>
          <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
            {/* Restaurant Name  */}
            <div>
              <Label>Restaurant Name</Label>
              <Input
                type="text"
                name="restaurantName"
                value={input.restaurantName}
                onChange={changeEventHandler}
                placeholder="Enter your restaurant name"
              />
              {errors.restaurantName && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.restaurantName}
                </span>
              )}
            </div>

            {/* City */}
            <div>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                value={input.city}
                onChange={changeEventHandler}
                placeholder="Enter your city name"
              />
              {errors.city && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.city}
                </span>
              )}
            </div>

            {/* Country */}
            <div>
              <Label>Country</Label>
              <Input
                type="text"
                name="country"
                value={input.country}
                onChange={changeEventHandler}
                placeholder="Enter your country name"
              />
              {errors.country && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.country}
                </span>
              )}
            </div>

            {/* Delivery Time */}
            <div>
              <Label>Delivery Time</Label>
              <Input
                type="number"
                name="deliveryTime"
                value={input.deliveryTime}
                onChange={changeEventHandler}
                placeholder="Enter your delivery time"
              />
              {errors.deliveryTime && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.deliveryTime}
                </span>
              )}
            </div>

            {/* Cuisines */}
            <div>
              <Label>Cuisines</Label>
              <Input
                type="text"
                name="cuisines"
                value={input.cuisines.join(", ")}
                onChange={(e) =>
                  setInput({ ...input, cuisines: e.target.value.split(",") })
                }
                placeholder="e.g. Momos, Biryani"
              />
              {errors.cuisines && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.cuisines}
                </span>
              )}
            </div>

            {/* File Upload */}
            <div>
              <Label>Upload Restaurant Banner</Label>
              <Input
                type="file"
                accept="image/*"
                name="imageFile"
                onChange={(e) =>
                  setInput({
                    ...input,
                    imageFile: e.target.files?.[0] || undefined,
                  })
                }
              />
              {errors.imageFile?.name && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.imageFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="my-5 w-fit">
            {loading ? (
              <Button disabled className="bg-orange hover:bg-hoverOrange">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="bg-orange hover:bg-hoverOrange">
                {restaurant ? "Update Your Restaurant" : "Add Your Restaurant"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Restaurant;
