import { MenuItem, RestaurantType, RestaurantOrder, RestaurantSearchResult, Restaurant } from "../types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:8000/api/v1/restaurant";
axios.defaults.withCredentials = true;

interface RestaurantStoreState {
  // State
  loading: boolean;
  currentRestaurant: RestaurantType | null;
  singleRestaurant: RestaurantType | null;
  userRestaurants: RestaurantType[];
  searchedRestaurants: RestaurantSearchResult | null;
  appliedFilters: string[];
  restaurantOrders: RestaurantOrder[];
  filterOptions: { cuisines: string[] };
  
  // Restaurant CRUD Operations
  createRestaurant: (formData: FormData) => Promise<RestaurantType>;
  getUserRestaurants: () => Promise<void>;
  getRestaurantById: (id: string) => Promise<void>;
  getSingleRestaurant: (id: string) => Promise<Restaurant | undefined>;
  updateRestaurant: (id: string, formData: FormData) => Promise<RestaurantType>;
  deleteRestaurant: (id: string) => Promise<void>;
  
  // Search & Filtering
  searchRestaurants: (
    searchText: string, 
    searchQuery: string, 
    selectedCuisines: string[],
    page?: number,
    limit?: number
  ) => Promise<void>;
  setAppliedFilters: (filters: string[]) => void;
  resetFilters: () => void;
  
  // Menu Management
  addMenuToRestaurant: (menu: MenuItem) => void;
  updateMenu: (menu: MenuItem) => void;
  deleteMenu: (menuId: string) => void;
  
  // Order Management
  getRestaurantOrders: (restaurantId?: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<RestaurantOrder>;
  
  // Utility
  setCurrentRestaurant: (restaurant: RestaurantType | null) => void;
}

export const useRestaurantStore = create<RestaurantStoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      loading: false,
      currentRestaurant: null,
      singleRestaurant: null,
      userRestaurants: [],
      searchedRestaurants: null,
      appliedFilters: [],
      restaurantOrders: [],
      filterOptions: { cuisines: [] },

      // Restaurant CRUD Operations
      createRestaurant: async (formData) => {
        set({ loading: true });
        try {
          const response = await axios.post<{ 
            success: boolean; 
            restaurant: RestaurantType;
            message?: string;
          }>(`${API_END_POINT}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
      
          if (response.data.success) {
            toast.success("Restaurant created successfully");
            set(state => ({
              userRestaurants: [...state.userRestaurants, response.data.restaurant], // Add to existing restaurants
              loading: false
            }));
            return response.data.restaurant;
          }
          throw new Error(response.data.message || "Failed to create restaurant");
        } catch (error: any) {
          set({ loading: false });
          
          // Handle restaurant limit/existing restaurant case
          if (error.response?.data?.message?.includes("already exists")) {
            try {
              // Fetch all user restaurants
              const { data } = await axios.get<{
                success: boolean;
                restaurants: RestaurantType[];
                message?: string;
              }>(`${API_END_POINT}/user`);
              
              if (data.success) {
                set({ 
                  userRestaurants: data.restaurants,
                  currentRestaurant: data.restaurants[0] || null
                });
              }
              throw new Error("RESTAURANT_LIMIT_REACHED");
            } catch (fetchError) {
              throw new Error("Failed to fetch existing restaurants");
            }
          }
          
          // Handle other errors
          const errorMessage = error.response?.data?.message || 
                             error.message || 
                             "Failed to create restaurant";
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      },

      getUserRestaurants: async () => {
        set({ loading: true });
        try {
          const response = await axios.get<{ 
            success: boolean; 
            restaurants: RestaurantType[] 
          }>(`${API_END_POINT}/user`);
          
          if (response.data.success) {
            set({
              userRestaurants: response.data.restaurants,
              loading: false
            });
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to fetch restaurants");
          set({ loading: false, userRestaurants: [] });
        }
      },

      getRestaurantById: async (id) => {
        set({ loading: true });
        try {
          const response = await axios.get<{ 
            success: boolean; 
            restaurant: RestaurantType 
          }>(`${API_END_POINT}/${id}`);
          
          if (response.data.success) {
            set({ 
              currentRestaurant: response.data.restaurant,
              loading: false 
            });
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to fetch restaurant");
          set({ loading: false, currentRestaurant: null });
        }
      },

      getSingleRestaurant: async (id) => {
        set({ loading: true });
        try {
          const response = await axios.get<{ 
            success: boolean; 
            restaurant: RestaurantType 
          }>(`${API_END_POINT}/${id}`);
          
          if (response.data.success) {
            set({ 
              singleRestaurant: response.data.restaurant,
              loading: false 
            });
            return response.data.restaurant;
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to fetch restaurant");
          set({ loading: false, singleRestaurant: null });
          throw error;
        }
      },

      updateRestaurant: async (id, formData) => {
        set({ loading: true });
        try {
          const response = await axios.put<{ 
            success: boolean; 
            restaurant: RestaurantType 
          }>(`${API_END_POINT}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          if (response.data.success) {
            toast.success("Restaurant updated successfully");
            set(state => ({
              userRestaurants: state.userRestaurants.map(r => 
                r._id === id ? response.data.restaurant : r
              ),
              currentRestaurant: response.data.restaurant,
              singleRestaurant: 
                state.singleRestaurant?._id === id ? response.data.restaurant : state.singleRestaurant,
              loading: false
            }));
            return response.data.restaurant;
          }
          throw new Error("Failed to update restaurant");
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update restaurant");
          set({ loading: false });
          throw error;
        }
      },

      deleteRestaurant: async (id) => {
        set({ loading: true });
        try {
          const response = await axios.delete<{ success: boolean }>(`${API_END_POINT}/${id}`);
          if (response.data.success) {
            toast.success("Restaurant deleted successfully");
            set(state => ({
              userRestaurants: state.userRestaurants.filter(r => r._id !== id),
              currentRestaurant: 
                state.currentRestaurant?._id === id ? null : state.currentRestaurant,
              singleRestaurant:
                state.singleRestaurant?._id === id ? null : state.singleRestaurant,
              loading: false
            }));
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to delete restaurant");
          set({ loading: false });
          throw error;
        }
      },

      // Search & Filtering
      searchRestaurants: async (searchText, searchQuery, selectedCuisines, page = 1, limit = 20) => {
        set({ loading: true });
        try {
          const params = new URLSearchParams();
          params.set("searchQuery", searchQuery);
          params.set("selectedCuisines", selectedCuisines.join(","));
          params.set("page", page.toString());
          params.set("limit", limit.toString());

          const response = await axios.get<RestaurantSearchResult>(
            `${API_END_POINT}/search/${searchText}?${params.toString()}`
          );
          
          set({ 
            searchedRestaurants: response.data,
            filterOptions: response.data.filters || { cuisines: [] },
            loading: false 
          });
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to search restaurants");
          set({ loading: false, searchedRestaurants: null });
        }
      },

      setAppliedFilters: (filters) => {
        set({ appliedFilters: filters });
      },

      resetFilters: () => {
        set({ appliedFilters: [] });
      },

      // Menu Management
      addMenuToRestaurant: (menu) => {
        set(state => ({
          currentRestaurant: state.currentRestaurant 
            ? { 
                ...state.currentRestaurant, 
                menus: [...(state.currentRestaurant.menus || []), menu] 
              } 
            : null
        }));
      },

      updateMenu: (updatedMenu) => {
        set(state => {
          if (!state.currentRestaurant) return state;
          
          const updatedMenus = (state.currentRestaurant.menus || []).map(menu => 
            menu._id === updatedMenu._id ? updatedMenu : menu
          );
          
          return {
            currentRestaurant: {
              ...state.currentRestaurant,
              menus: updatedMenus
            }
          };
        });
      },

      deleteMenu: (menuId) => {
        set(state => {
          if (!state.currentRestaurant) return state;
          
          const updatedMenus = (state.currentRestaurant.menus || []).filter(
            menu => menu._id !== menuId
          );
          
          return {
            currentRestaurant: {
              ...state.currentRestaurant,
              menus: updatedMenus
            }
          };
        });
      },

      // Order Management
      getRestaurantOrders: async (restaurantId) => {
        set({ loading: true });
        try {
          const url = restaurantId 
            ? `${API_END_POINT}/${restaurantId}/orders`
            : `${API_END_POINT}/orders`;
            
          const response = await axios.get<{
            success: boolean;
            orders: RestaurantOrder[];
          }>(url);
          
          if (response.data.success) {
            set({ 
              restaurantOrders: response.data.orders,
              loading: false 
            });
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to fetch orders");
          set({ loading: false, restaurantOrders: [] });
        }
      },

      updateOrderStatus: async (orderId, status) => {
        try {
          const response = await axios.put<{
            success: boolean;
            order: RestaurantOrder;
          }>(
            `${API_END_POINT}/orders/${orderId}/status`, 
            { status }, 
            { headers: { 'Content-Type': 'application/json' } }
          );
          
          if (response.data.success) {
            const updatedOrders = get().restaurantOrders.map(order => 
              order._id === orderId ? response.data.order : order
            );
            
            set({ restaurantOrders: updatedOrders });
            toast.success("Order status updated successfully");
            return response.data.order;
          }
          throw new Error("Failed to update order status");
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update order status");
          throw error;
        }
      },

      // Utility
      setCurrentRestaurant: (restaurant) => {
        set({ currentRestaurant: restaurant });
      }
    }),
    {
      name: 'restaurant-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentRestaurant: state.currentRestaurant,
        singleRestaurant: state.singleRestaurant,
        userRestaurants: state.userRestaurants,
        appliedFilters: state.appliedFilters
      })
    }
  )
);