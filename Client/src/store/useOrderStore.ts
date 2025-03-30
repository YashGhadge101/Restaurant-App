import { CheckoutSessionRequest, OrderState } from "../types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner"; // Import toast for better UI feedback

const API_END_POINT = "http://localhost:8000/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      loading: false,
      orders: [],

      // ✅ Create checkout session
      createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
          console.log("📤 Sending checkout session request:", checkoutSession);

          if (!checkoutSession.restaurantId) {
            console.error("❌ restaurantId is missing in the request!");
            toast.error("Restaurant ID is required!");
            return;
          }

          set({ loading: true });

          const { data } = await axios.post(
            `${API_END_POINT}/checkout/create-checkout-session`,
            checkoutSession,
            { headers: { "Content-Type": "application/json" } }
          );

          if (data?.session?.url) {
            console.log("✅ Redirecting to:", data.session.url);
            window.open(data.session.url, "_self");
          } else {
            console.error("❌ Error: No session URL received from the API.");
            toast.error("Error: No session URL received. Try again!");
          }
        } catch (error: any) {
          console.error("❌ Axios Error:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "Checkout failed!");
        } finally {
          set({ loading: false });
        }
      },

      // ✅ Get order details
      getOrderDetails: async () => {
        try {
          set({ loading: true, orders: [] });

          const { data } = await axios.get(`${API_END_POINT}/`, {
            withCredentials: true, // Ensure cookies/session are sent
          });

          console.log("📦 Orders Retrieved:", data.orders);

          if (data?.orders) {
            set({ orders: data.orders });
          } else {
            console.warn("⚠️ No orders found.");
            toast.warning("No orders found.");
          }
        } catch (error: any) {
          console.error("❌ Axios Error:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "Failed to fetch orders.");
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
