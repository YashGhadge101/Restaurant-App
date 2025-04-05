// orderType.ts

export type CheckoutSessionRequest = {
    cartItems: {
      menuId: string;
      name: string;
      image: string; // Keep as string, but ensure data is validated
      price: string;
      quantity: string;
    }[];
    deliveryDetails: {
      name: string;
      email: string;
      contact: string;
      address: string;
      city: string;
      country: string;
    };
    restaurantId: string;
  };
  
  export interface Orders extends CheckoutSessionRequest {
    _id: string;
    status: string;
    totalAmount: number;
  }
  
  export type OrderState = {
    loading: boolean;
    orders: Orders[];
    createCheckoutSession: (checkoutSessionRequest: CheckoutSessionRequest) => Promise<void>;
    getOrderDetails: () => Promise<void>;
  };
  
  // Example usage in your component/service (where you create cartItems):
  
  // Assuming 'yourCartData' is of type:
  // { menuId: string; name: string; image: string | undefined; price: string; quantity: string; }[]
  
  export const createCheckoutRequest = (yourCartData: {
    menuId: string;
    name: string;
    image: string | undefined;
    price: string;
    quantity: string;
  }[], deliveryDetails: CheckoutSessionRequest['deliveryDetails'], restaurantId: string): CheckoutSessionRequest => {
    const cartItems = yourCartData
      .filter(item => item.image !== undefined) // Filter out items with undefined images
      .map(item => ({
        menuId: item.menuId,
        name: item.name,
        image: item.image as string, // Type assertion (if you're sure it's not undefined)
        price: item.price,
        quantity: item.quantity,
      }));
  
    return {
      cartItems: cartItems,
      deliveryDetails: deliveryDetails,
      restaurantId: restaurantId,
    };
  };
  
  // Example usage in your component/service:
  // const checkoutRequest = createCheckoutRequest(yourCartData, deliveryDetails, restaurantId);
  
  // Then you can pass 'checkoutRequest' to your createCheckoutSession function:
  // createCheckoutSession(checkoutRequest);