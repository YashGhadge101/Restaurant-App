import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { MenuItem, RestaurantState, Restaurant } from "../types/restaurantType";
import { OrderStatus } from "src/types/orderType";

const API_END_POINT = "http://localhost:8000/api/v1/restaurant";
axios.defaults.withCredentials = true;

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set) => ({
      loading: false,
      restaurants: [],
      searchedRestaurant: null,
      appliedFilter: [],
      singleRestaurant: null,
      restaurantOrders: [],
      restaurant: null,

      createRestaurant: async (formData: FormData) => {
        set({ loading: true });
        try {
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
          if (error.response) {
            toast.error(error.response.data.message || "Server error");
          } else if (error.request) {
            toast.error("No response from server");
          } else {
            toast.error("An unexpected error occurred.");
          }
          set({ loading: false });
        }
      },

      getRestaurants: async () => {
        set({ loading: true });
        try {
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
        set({ loading: true });
        try {
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

      searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: string[]) => {
        set({ loading: true });
        try {
          const params = new URLSearchParams();
          params.set("searchQuery", searchQuery);
          params.set("selectedCuisines", selectedCuisines.join(","));
          const response = await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
          if (response.data.success) {
            set({ loading: false, searchedRestaurant: response.data });
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to search restaurants.");
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
        set({ loading: true });
        try {
          const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
          if (response.data.success) {
            set({
              singleRestaurant: response.data.restaurant as Restaurant & {
                menus: MenuItem[];
              },
              restaurant: response.data.restaurant as Restaurant & {
                menus: MenuItem[];
              },
              loading: false,
            });
            return response.data.restaurant as Restaurant & { menus: MenuItem[] };
          }
          set({ singleRestaurant: null, restaurant: null, loading: false });
          return null;
        } catch (error: any) {
          set({ singleRestaurant: null, restaurant: null, loading: false });
          return null;
        }
      },

      getRestaurantOrders: async () => {
        set({ loading: true });
        try {
          const { data } = await axios.get(`${API_END_POINT}/restaurant/order`);
          set({ restaurantOrders: data.orders });
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to fetch orders.");
          set({ restaurantOrders: [] });
        } finally {
          set({ loading: false });
        }
      },

      updateOrderStatus: async (orderId: string, status: OrderStatus) => {
        set({ loading: true });
        try {
          const url = `${API_END_POINT}/${orderId}/status`;
          
          // Get auth token properly (adjust based on your storage)
          const authToken = localStorage.getItem('authToken') || ''; // or from cookies/state
          
          const config = {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          };
          
          await axios.put(url, { status }, config);
      
          // Optimistic update
          set((state) => ({
            restaurantOrders: state.restaurantOrders.map((order) =>
              order._id === orderId ? { ...order, status } : order
            ),
          }));
      
          toast.success(`Order status updated to ${status}`);
          
        } catch (error: any) {
          console.error('Update error:', error);
          
          // Revert optimistic update
          set((state) => ({
            restaurantOrders: state.restaurantOrders.map((order) =>
              order._id === orderId ? { ...order, status: order.status } : order
            ),
          }));
          
          toast.error(
            error.response?.data?.message || 
            error.message || 
            "Failed to update order status."
          );
        } finally {
          set({ loading: false });
        }
      },
      getRestaurantMenus: async (restaurantId: string) => {
        set({ loading: true });
        try {
          const response = await axios.get(`${API_END_POINT}/${restaurantId}/menus`);
          if (response.data.success) {
            set({ loading: false });
            return response.data.menus as MenuItem[];
          }
          return [];
        } catch (error) {
          set({ loading: false });
          return [];
        }
      },
    }),
    {
      name: "restaurant-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
