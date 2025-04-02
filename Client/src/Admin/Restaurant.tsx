import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../components/alert";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

interface RestaurantFormState {
  restaurantName: string;
  city: string;
  country: string;
  deliveryTime: number;
  cuisines: string[]; // Explicitly typed as string array
  imageFile?: File;
  imagePreview: string;
}

const Restaurant = () => {
  const [input, setInput] = useState<RestaurantFormState>({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: 0,
    cuisines: [], // Now properly typed as string[]
    imagePreview: ""
  });

  const [errors, setErrors] = useState({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: "",
    cuisines: "",
    imageFile: ""
  });

  const navigate = useNavigate();

  const {
    loading,
    currentRestaurant,
    userRestaurants,
    updateRestaurant,
    createRestaurant,
    getRestaurantById,
    getUserRestaurants,
  } = useRestaurantStore();

  const hasRestaurant = userRestaurants.length > 0;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*')) {
        setErrors({...errors, imageFile: "Only image files are allowed"});
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({...errors, imageFile: "File size must be less than 5MB"});
        return;
      }

      setInput({
        ...input,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
      setErrors({...errors, imageFile: ""});
    }
  };

  const handleCuisinesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cuisinesArray = e.target.value
      .split(',')
      .map(item => item.trim())
      .filter(item => item);
    
    setInput({
      ...input,
      cuisines: cuisinesArray
    });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = {...errors};

    if (!input.restaurantName.trim()) {
      newErrors.restaurantName = "Restaurant name is required";
      isValid = false;
    }

    if (!input.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!input.country.trim()) {
      newErrors.country = "Country is required";
      isValid = false;
    }

    if (input.deliveryTime <= 0) {
      newErrors.deliveryTime = "Delivery time must be positive";
      isValid = false;
    }

    if (input.cuisines.length === 0) {
      newErrors.cuisines = "At least one cuisine is required";
      isValid = false;
    }

    if (!currentRestaurant && !input.imageFile) {
      newErrors.imageFile = "Image is required";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

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

      if (currentRestaurant?._id) {
        await updateRestaurant(currentRestaurant._id, formData);
        toast.success("Restaurant updated successfully");
      } else {
        await createRestaurant(formData);
        toast.success("Restaurant created successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          toast.error("Server error. Please try again later.");
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Form submission error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUserRestaurants();
        if (hasRestaurant && !currentRestaurant) {
          await getRestaurantById(userRestaurants[0]._id);
        } else if (currentRestaurant?._id) {
          await getRestaurantById(currentRestaurant._id);
        }
      } catch (error) {
        toast.error("Failed to load restaurant data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (currentRestaurant) {
      setInput({
        restaurantName: currentRestaurant.restaurantName || "",
        city: currentRestaurant.city || "",
        country: currentRestaurant.country || "",
        deliveryTime: currentRestaurant.deliveryTime || 0,
        cuisines: currentRestaurant.cuisines || [],
        imageFile: undefined,
        imagePreview: currentRestaurant.imageUrl || ""
      });
    }
  }, [currentRestaurant]);

  if (hasRestaurant && !currentRestaurant) {
    return (
      <div className="max-w-6xl mx-auto my-10">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Restaurant Found</AlertTitle>
          <AlertDescription>
            You already have a restaurant.
            <Button 
              variant="link" 
              className="ml-2 p-0 h-auto" 
              onClick={() => navigate(`/restaurant/${userRestaurants[0]._id}`)}
            >
              View your restaurant
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div>
        <h1 className="font-extrabold text-2xl mb-5">
          {currentRestaurant ? "Update Restaurant" : "Add Restaurant"}
        </h1>
        <form onSubmit={submitHandler}>
          <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
            <div>
              <Label>Restaurant Name</Label>
              <Input
                type="text"
                name="restaurantName"
                value={input.restaurantName}
                onChange={(e) => setInput({...input, restaurantName: e.target.value})}
                placeholder="Enter your restaurant name"
              />
              {errors.restaurantName && <span className="text-xs text-red-600 font-medium">{errors.restaurantName}</span>}
            </div>
            <div>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                value={input.city}
                onChange={(e) => setInput({...input, city: e.target.value})}
                placeholder="Enter your city name"
              />
              {errors.city && <span className="text-xs text-red-600 font-medium">{errors.city}</span>}
            </div>
            <div>
              <Label>Country</Label>
              <Input
                type="text"
                name="country"
                value={input.country}
                onChange={(e) => setInput({...input, country: e.target.value})}
                placeholder="Enter your country name"
              />
              {errors.country && <span className="text-xs text-red-600 font-medium">{errors.country}</span>}
            </div>
            <div>
              <Label>Delivery Time (minutes)</Label>
              <Input
                type="number"
                name="deliveryTime"
                value={input.deliveryTime}
                onChange={(e) => setInput({...input, deliveryTime: Number(e.target.value)})}
                placeholder="Enter delivery time"
              />
              {errors.deliveryTime && <span className="text-xs text-red-600 font-medium">{errors.deliveryTime}</span>}
            </div>
            <div>
              <Label>Cuisines (comma separated)</Label>
              <Input
                type="text"
                name="cuisines"
                value={input.cuisines.join(", ")}
                onChange={handleCuisinesChange}
                placeholder="e.g. Italian, Chinese, Mexican"
              />
              {errors.cuisines && <span className="text-xs text-red-600 font-medium">{errors.cuisines}</span>}
            </div>
            <div>
              <Label>Restaurant Image</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
              />
              {errors.imageFile && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.imageFile}
                </span>
              )}
              {input.imagePreview && (
                <div className="mt-2">
                  <img 
                    src={input.imagePreview} 
                    alt="Preview" 
                    className="h-32 w-32 object-cover rounded-md"
                  />
                </div>
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
              <Button type="submit" className="bg-orange hover:bg-hoverOrange">
                {currentRestaurant ? "Update Restaurant" : "Add Restaurant"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Restaurant;