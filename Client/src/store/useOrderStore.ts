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

      await axios.put(`${API_END_POINT}/${orderId}/status`, { status });

      toast.success(`Order status updated to ${status}`);

      set((state) => ({
        restaurantOrders: state.restaurantOrders.map((order) =>
          order._id === orderId ? { ...order, status: status.toLowerCase() as Order["status"] } : order
        ),
      }));

      const { data } = await axios.get(`${API_END_POINT}/restaurant/order`);
      set({ restaurantOrders: data.orders });
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
