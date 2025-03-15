import { CheckoutSessionRequest, OrderState } from "../types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner"; // Import toast for better UI feedback

const API_END_POINT: string = "http://localhost:8000/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      loading: false,
      orders: [],

      createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
          console.log("📤 Sending checkout session request:", checkoutSession);

          if (!checkoutSession.restaurantId) {
            console.error("❌ restaurantId is missing in the request!");
            toast.error("Restaurant ID is required!");
            return;
          }

          set({ loading: true });

          const response = await axios.post(
            `${API_END_POINT}/checkout/create-checkout-session`,
            checkoutSession,
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.data?.session?.url) {
            console.log("✅ Redirecting to:", response.data.session.url);
            window.open(response.data.session.url, "_self");
          } else {
            console.error("❌ Error: No session URL received from the API.");
            toast.error("Error: No session URL received. Try again!");
          }

        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.error("❌ Axios error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Checkout failed!");
          } else {
            console.error("❌ Unexpected error:", error);
            toast.error("An unexpected error occurred.");
          }
        } finally {
          set({ loading: false });
        }
      },

      getOrderDetails: async () => {
        try {
          set({ loading: true, orders: [] });
      
          const response = await axios.get(`${API_END_POINT}/`, {
            withCredentials: true, // Ensure cookies/session are sent
          });
      
          console.log("📦 Response:", response); // Debugging
      
          if (response.data?.orders) {
            console.log("✅ Orders retrieved:", response.data.orders);
            set({ orders: response.data.orders });
          } else {
            console.warn("⚠️ No orders found.");
            toast.warning("No orders found.");
          }
      
        } catch (error: unknown) {
          console.error("❌ Axios Error:", error); // Log full error
      
          if (axios.isAxiosError(error)) {
            console.error("📌 Axios Response Data:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to fetch orders.");
          } else {
            toast.error("An unexpected error occurred.");
          }
        } finally {
          set({ loading: false });
        }
      },      
    }),
    {
      name: "order-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
