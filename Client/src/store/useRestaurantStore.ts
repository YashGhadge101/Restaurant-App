import { Orders } from "../types/orderType";
import { MenuItem, RestaurantState, Restaurant } from "../types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:8000/api/v1/restaurant";
axios.defaults.withCredentials = true;

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      loading: false,
      restaurants: [],
      searchedRestaurant: null,
      appliedFilter: [],
      singleRestaurant: null,
      restaurantOrder: [],
      restaurant: null,

      createRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set((state) => ({
              restaurants: [...state.restaurants, response.data.restaurant],
              loading: false,
            }));
          }
        } catch (error: any) {
          console.error("Error creating restaurant:", error);
          console.log("Full error object:", error);

          if (error.response) {
            console.log("Server response:", error.response);
            toast.error(error.response.data.message || "Server error");
          } else if (error.request) {
            console.log("Request error:", error.request);
            toast.error("No response from server");
          } else {
            toast.error("An unexpected error occurred.");
          }

          set({ loading: false });
        }
      },
      getRestaurants: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          if (response.data.success) {
            set({ loading: false, restaurants: response.data.restaurants });
          }
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            set({ restaurants: [] });
          }
          set({ loading: false });
        }
      },
      updateRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const restaurantId = formData.get("restaurantId") as string;
          const response = await axios.put(`${API_END_POINT}/${restaurantId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set((state) => ({
              restaurants: state.restaurants.map((restaurant) =>
                restaurant._id === response.data.restaurant._id ? response.data.restaurant : restaurant
              ),
              loading: false,
            }));
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },
      searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: any) => {
        try {
          set({ loading: true });
          const params = new URLSearchParams();
          params.set("searchQuery", searchQuery);
          params.set("selectedCuisines", selectedCuisines.join(","));
          const response = await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
          if (response.data.success) {
            set({ loading: false, searchedRestaurant: response.data });
          }
        } catch (error) {
          set({ loading: false });
        }
      },
      addMenuToRestaurant: (menu: MenuItem) => {
        set((state: RestaurantState) => {
          const restaurantIndex = state.restaurants.findIndex((r: Restaurant) => r._id === menu.restaurantId);
          if (restaurantIndex !== -1) {
            const updatedRestaurants = [...state.restaurants];
            updatedRestaurants[restaurantIndex] = {
              ...updatedRestaurants[restaurantIndex],
              menus: [...(updatedRestaurants[restaurantIndex].menus || []), menu],
            };
            return { restaurants: updatedRestaurants };
          }
          return state;
        });
      },

      updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state: RestaurantState) => {
          const restaurantIndex = state.restaurants.findIndex((r: Restaurant) => r._id === updatedMenu.restaurantId);
          if (restaurantIndex !== -1) {
            const updatedRestaurants = [...state.restaurants];
            updatedRestaurants[restaurantIndex] = {
              ...updatedRestaurants[restaurantIndex],
              menus: (updatedRestaurants[restaurantIndex].menus || []).map((menu: MenuItem) =>
                menu._id === updatedMenu._id ? updatedMenu : menu
              ),
            };
            return { restaurants: updatedRestaurants };
          }
          return state;
        });
      },
      setAppliedFilter: (value: string) => {
        set((state) => {
          const isAlreadyApplied = state.appliedFilter.includes(value);
          const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item) => item !== value) : [...state.appliedFilter, value];
          return { appliedFilter: updatedFilter };
        });
      },
      resetAppliedFilter: () => {
        set({ appliedFilter: [] });
      },
      getSingleRestaurant: async (restaurantId: string) => {
        try {
          const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
          if (response.data.success) {
            return response.data.restaurant as Restaurant & { menus: MenuItem[] };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
      getRestaurantOrders: async () => {
        try {
          const response = await axios.get(`${API_END_POINT}/order`);
          if (response.data.success) {
            set({ restaurantOrder: response.data.orders });
          }
        } catch (error) {
          console.log(error);
        }
      },
      updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
          const response = await axios.put(`${API_END_POINT}/order/${orderId}/status`, { status }, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.data.success) {
            const updatedOrder = get().restaurantOrder.map((order: Orders) => {
              return order._id === orderId ? { ...order, status: response.data.status } : order;
            });
            set({ restaurantOrder: updatedOrder });
            toast.success(response.data.message);
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      },
    }),
    {
      name: "restaurant-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);