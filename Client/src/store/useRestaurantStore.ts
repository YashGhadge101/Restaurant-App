import { MenuItem, RestaurantState, SearchedRestaurant } from "../types/restaurantType";
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
      restaurant: null,
      searchedRestaurant: null,
      appliedFilter: [],
      singleRestaurant: null,
      restaurantOrder: [],
      filterOptions: { cuisines: [] }, // Added missing property

      createRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          if (response.data.success) {
            toast.success(response.data.message);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to create restaurant");
        } finally {
          set({ loading: false });
        }
      },

      getRestaurant: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          if (response.data.success) {
            set({ restaurant: response.data.restaurant });
          }
        } catch (error: any) {
          if (error.response?.status === 404) {
            set({ restaurant: null });
          }
        } finally {
          set({ loading: false });
        }
      },

      updateRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(`${API_END_POINT}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          if (response.data.success) {
            toast.success(response.data.message);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update restaurant");
        } finally {
          set({ loading: false });
        }
      },

      searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: string[]) => {
        try {
          set({ loading: true });
          
          const params = new URLSearchParams();
          const searchTerm = searchText || searchQuery;
          params.set("search", searchTerm);
          
          if (selectedCuisines.length > 0) {
            params.set("cuisines", selectedCuisines.join(","));
          }

          const response = await axios.get(`${API_END_POINT}/restaurants/search?${params.toString()}`);
          
          if (response.data.success) {
            const searchedData: SearchedRestaurant = {
              data: response.data.data,
              filterOptions: response.data.filterOptions || { cuisines: [] }
            };
            
            set({ 
              loading: false,
              searchedRestaurant: searchedData,
              filterOptions: searchedData.filterOptions
            });
          }
        } catch (error) {
          console.error("Search error:", error);
          set({ loading: false });
        }
      },

      addMenuToRestaurant: (menu: MenuItem) => {
        set((state) => ({
          restaurant: state.restaurant 
            ? { 
                ...state.restaurant, 
                menus: [...state.restaurant.menus, menu] 
              } 
            : null
        }));
      },

      updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state) => {
          if (!state.restaurant) return state;
          
          const updatedMenuList = state.restaurant.menus.map((menu) => 
            menu._id === updatedMenu._id ? updatedMenu : menu
          );
          
          return {
            restaurant: {
              ...state.restaurant,
              menus: updatedMenuList
            }
          };
        });
      },

      setAppliedFilter: (value: string) => {
        set((state) => {
          const isAlreadyApplied = state.appliedFilter.includes(value);
          return { 
            appliedFilter: isAlreadyApplied 
              ? state.appliedFilter.filter((item) => item !== value) 
              : [...state.appliedFilter, value] 
          };
        });
      },

      resetAppliedFilter: () => {
        set({ appliedFilter: [] });
      },

      getSingleRestaurant: async (restaurantId: string) => {
        try {
          const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
          if (response.data.success) {
            set({ singleRestaurant: response.data.restaurant });
          }
        } catch (error) {
          console.error("Failed to fetch restaurant:", error);
        }
      },

      getRestaurantOrders: async () => {
        try {
          const response = await axios.get(`${API_END_POINT}/order`);
          if (response.data.success) {
            set({ restaurantOrder: response.data.orders });
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      },

      updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
          const response = await axios.put(
            `${API_END_POINT}/order/${orderId}/status`, 
            { status }, 
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.data.success) {
            const updatedOrders = get().restaurantOrder.map((order) => 
              order._id === orderId ? { ...order, status } : order
            );
            
            set({ restaurantOrder: updatedOrders });
            toast.success(response.data.message);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update order");
        }
      }
    }),
    {
      name: 'restaurant-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        restaurant: state.restaurant,
        singleRestaurant: state.singleRestaurant
      })
    }
  )
);