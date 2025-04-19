import { Order, OrderStatus } from "./orderType";

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  restaurantId: string;
}

export type Restaurant = {
  _id: string;
  user: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryTime: number;
  cuisines: string[];
  menus?: MenuItem[];
  imageUrl: string;
};

export type SearchedRestaurant = {
  data: Restaurant[];
};

export type RestaurantState = {
  loading: boolean;
  restaurant: Restaurant | null;
  restaurants: Restaurant[];
  searchedRestaurant: SearchedRestaurant | null;
  appliedFilter: string[];
  singleRestaurant: Restaurant | null;
  restaurantOrders: Order[];
  createRestaurant: (formData: FormData) => Promise<void>;
  getRestaurants: () => Promise<void>;
  updateRestaurant: (formData: FormData) => Promise<void>;
  searchRestaurant: (
    searchText: string,
    searchQuery: string,
    selectedCuisines: string[]
  ) => Promise<void>;
  addMenuToRestaurant: (menu: MenuItem) => void;
  updateMenuToRestaurant: (menu: MenuItem) => void;
  setAppliedFilter: (value: string) => void;
  resetAppliedFilter: () => void;
  getSingleRestaurant: (restaurantId: string) => Promise<Restaurant & { menus: MenuItem[] } | null>;
  getRestaurantOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getRestaurantMenus: (restaurantId: string) => Promise<MenuItem[]>;
};