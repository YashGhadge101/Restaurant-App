export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "outfordelivery"
  | "delivered";

export type Order = {
  _id: string;
  restaurant: any; // Replace with actual Restaurant type if available
  user: any;       // Replace with actual User type if available
  deliveryDetails: {
    name: string;
    email?: string;
    address: string;
    city?: string;
  };
  cartItems: {
    menuId: string;
    name: string;
    image: string;
    price: number; // Numeric for calculations
    quantity: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type OrderState = {
  loading: boolean;
  orders: Order[];
  restaurantOrders: Order[];
  createCheckoutSession: (checkoutSession: CheckoutSessionRequest) => Promise<void>;
  getOrderDetails: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>; // Strictly typed status
};

export type CheckoutSessionRequest = {
  restaurantId: string;
  deliveryDetails: {
    name: string;
    email?: string;
    contact?: string;
    address: string;
    city?: string;
    country?: string;
  };
  cartItems: {
    menuId: string;
    name?: string;
    image?: string;
    price?: string;  // Sent as string, convert later
    quantity: string;
  }[];
};
