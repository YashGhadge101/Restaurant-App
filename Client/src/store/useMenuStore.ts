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
          // No changes needed here, as formData already contains restaurantId
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (!response.data.success) {
            throw new Error(response.data.message);
          }

          set({ loading: false, menu: response.data.menu });
          useRestaurantStore.getState().addMenuToRestaurant(response.data.menu);
          toast.success("Menu created successfully!");
        } catch (error: any) {
          set({ loading: false });
          const message =
            error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred.";
          toast.error(message);
          throw error;
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

          set({ loading: false, menu: response.data.menu });
          useRestaurantStore.getState().updateMenuToRestaurant(response.data.menu);
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