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
          const { data } = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (data.success) {
            toast.success(data.message);
            set({ menu: data.menu }); // ✅ Update menu state
            useRestaurantStore.getState().addMenuToRestaurant(data.menu);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
          set({ loading: false }); // ✅ Ensure loading stops
        }
      },

      // ✅ Edit menu function
      editMenu: async (menuId: string, formData: FormData) => {
        try {
          set({ loading: true }); // Start loading
          const { data } = await axios.put(`${API_END_POINT}/${menuId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (data.success) {
            toast.success(data.message);
            set({ menu: data.menu }); // ✅ Update menu state
            useRestaurantStore.getState().updateMenuToRestaurant(data.menu);
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
