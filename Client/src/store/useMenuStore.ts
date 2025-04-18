import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";

const API_END_POINT = "http://localhost:8000/api/v1/menu";
axios.defaults.withCredentials = true;

type Menu = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: string;
};

type MenuState = {
  loading: boolean;
  menu: Menu | null;
  createMenu: (formData: FormData) => Promise<void>;
  editMenu: (menuId: string, formData: FormData) => Promise<void>;
};

export const useMenuStore = create<MenuState>()(
  persist(
      (set) => ({
          loading: false,
          menu: null,
          createMenu: async (formData: FormData) => {
            set({ loading: true });
            try {
              // Log the endpoint for debugging
              console.log("Sending request to:", `${API_END_POINT}/`);
        
              const response = await axios.post(`${API_END_POINT}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
        
              // Check the response for success
              if (!response.data.success) {
                throw new Error(response.data.message);
              }
        
              const newMenu = response.data.menu;
              set({ loading: false, menu: newMenu });
        
              // Refresh restaurant menus after creation
              await useRestaurantStore.getState().getRestaurantMenus(newMenu.restaurantId);
        
              toast.success("Menu created successfully!");
        
            } catch (error: any) {
              set({ loading: false });
        
              // Log the error for debugging purposes
              console.error("Error creating menu:", error);
        
              // Handle different types of errors
              const message =
                error.response?.data?.message ||
                error.message ||
                "An unexpected error occurred.";
        
              // Show an error toast with the message
              toast.error(message);
        
              throw error; // Optionally rethrow or handle the error as needed
            }
          },
         editMenu: async (menuId: string, formData: FormData) => {
              set({ loading: true });
              try {
                  const response = await axios.put(
                      `${API_END_POINT}/${menuId}`,
                      formData,
                      { headers: { "Content-Type": "multipart/form-data" } }
                  );

                  if (!response.data.success) {
                      throw new Error(response.data.message);
                  }

                  const updatedMenu = response.data.menu;
                  set({ loading: false, menu: updatedMenu });
                  
                  // Refresh restaurant menus after update
                  await useRestaurantStore.getState().getRestaurantMenus(updatedMenu.restaurantId);
                  
                  toast.success(response.data.message);
              } catch (error: any) {
                  set({ loading: false });
                  const message =
                      error.response?.data?.message || "An unexpected error occurred.";
                  toast.error(message);
                  throw error;
              }
          },
      }),
      {
          name: "menu-name",
          storage: createJSONStorage(() => localStorage),
      }
  )
);