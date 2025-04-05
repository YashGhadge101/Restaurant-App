// restaurantType.ts

import { Orders } from "./orderType";

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
  restaurantOrder: Orders[];
  createRestaurant: (formData: FormData) => Promise<void>;
  getRestaurants: () => Promise<void>;
  updateRestaurant: (formData: FormData) => Promise<void>;
  searchRestaurant: (
    searchText: string,
    searchQuery: string,
    selectedCuisines: any
  ) => Promise<void>;
  addMenuToRestaurant: (menu: MenuItem) => void;
  updateMenuToRestaurant: (menu: MenuItem) => void;
  setAppliedFilter: (value: string) => void;
  resetAppliedFilter: () => void;
  getSingleRestaurant: (restaurantId: string) => Promise<Restaurant & { menus: MenuItem[] } | null>; // Corrected return type
  getRestaurantOrders: () => Promise<void>;
  updateRestaurantOrder: (orderId: string, status: string) => Promise<void>;
};