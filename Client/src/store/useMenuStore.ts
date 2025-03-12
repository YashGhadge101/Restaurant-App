import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";

const API_END_POINT = "http://localhost:8000/api/v1/menu";
axios.defaults.withCredentials = true;

type MenuState = {
  loading: boolean;
  menu: any | null;
  setLoading: (loading: boolean) => void;
  createMenu: (formData: FormData) => Promise<void>;
  editMenu: (menuId: string, formData: FormData) => Promise<void>;
};

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      loading: false,
      menu: null,

      // ✅ Set loading state function
      setLoading: (loading) => set({ loading }),

      // ✅ Create menu function
      createMenu: async (formData: FormData) => {
        try {
          set({ loading: true }); // Start loading
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, menu: response.data.menu }); // ✅ Stop loading
            useRestaurantStore.getState().addMenuToRestaurant(response.data.menu);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
          set({ loading: false }); // ✅ Ensure loading is stopped in all cases
        }
      },

      // ✅ Edit menu function
      editMenu: async (menuId: string, formData: FormData) => {
        try {
          set({ loading: true }); // Start loading
          const response = await axios.put(`${API_END_POINT}/${menuId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, menu: response.data.menu }); // ✅ Stop loading
            useRestaurantStore.getState().updateMenuToRestaurant(response.data.menu);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
          set({ loading: false }); // ✅ Ensure loading stops
        }
      },
    }),
    {
      name: "menu-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
