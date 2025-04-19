import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import { CheckoutSessionRequest, Order, OrderState } from "../types/orderType";

const API_END_POINT = "http://localhost:8000/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>((set) => ({
  loading: false,
  orders: [],
  restaurantOrders: [],

  createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
    try {
      set({ loading: true });
      const response = await axios.post(
        `${API_END_POINT}/checkout/create-checkout-session`,
        checkoutSession,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.href = response.data.session.url;
    } catch (error) {
      toast.error("Failed to create checkout session.");
    } finally {
      set({ loading: false });
    }
  },

  getOrderDetails: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get(`${API_END_POINT}/user`);
      set({ orders: data.orders });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch orders.");
      set({ orders: [] });
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId: string, status: Order["status"]) => {
    try {
      set({ loading: true });

      // Convert status to lowercase and assert it as Order["status"]
      const lowerStatus = status.toLowerCase() as Order["status"];
      
      await axios.put(`${API_END_POINT}/order/${orderId}/status`, { 
        status: lowerStatus 
      });

      toast.success(`Order status updated to ${status}`);

      // Update state with proper typing
      set((state) => ({
        ...state,  // Include all other state properties
        restaurantOrders: state.restaurantOrders.map((order) =>
          order._id === orderId ? { ...order, status: lowerStatus } : order
        ),
      }));

    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status."
      );
    } finally {
      set({ loading: false });
    }
  },
}));
