import { Orders } from "./orderType";

export type MenuItem = {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
};

export type Restaurant = {
    _id: string;
    user: string;
    restaurantName: string;
    city: string;
    country: string;
    deliveryTime: number;
    cuisines: string[];
    menus: MenuItem[];
    imageUrl: string;
};

export type RestaurantType = Restaurant;

export type FilterOptions = {
    cuisines: string[];
    dietary?: string[];
    features?: string[];
};

export interface SearchedRestaurant {
    success: boolean;
    data: Restaurant[];
    filterOptions?: {
        cuisines: string[];
    };
}

export type RestaurantOrder = Orders;

export interface RestaurantSearchResult {
    data: Restaurant[];
    filters?: {
      cuisines: string[];
    };
    // Add other properties if your API returns more
    page?: number;
    totalPages?: number;
    totalRestaurants?: number;
  }

export type RestaurantState = {
    loading: boolean;
    restaurant: Restaurant | null;
    searchedRestaurant: SearchedRestaurant | null;
    appliedFilter: string[];
    appliedFilters: string[];
    singleRestaurant: Restaurant | null;
    restaurantOrder: Orders[];
    filterOptions: FilterOptions;
    createRestaurant: (formData: FormData) => Promise<void>;
    getRestaurant: () => Promise<void>;
    updateRestaurant: (formData: FormData) => Promise<void>;
    searchRestaurant: (searchText: string, searchQuery: string, selectedCuisines: string[]) => Promise<void>;
    addMenuToRestaurant: (menu: MenuItem) => void;
    updateMenuToRestaurant: (menu: MenuItem) => void;
    setAppliedFilter: (value: string) => void;
    resetAppliedFilter: () => void;
    getSingleRestaurant: (restaurantId: string) => Promise<void>;
    getRestaurantOrders: () => Promise<void>;
    updateRestaurantOrder: (orderId: string, status: string) => Promise<void>;
    setAppliedFilters: (filters: string[]) => void;
    resetFilters: () => void;
};