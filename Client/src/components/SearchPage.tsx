import { Link, useParams } from "react-router-dom";
import FilterPage from "./FilterPage";
import { Input } from "./ui/input";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { Restaurant } from "../types/restaurantType";

const SearchPage = () => {
  const { text } = useParams<{ text: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const {
    loading,
    searchedRestaurants,
    searchRestaurants,
    setAppliedFilters,
    appliedFilters,
  } = useRestaurantStore();

  const handleSearch = useCallback(() => {
    if (text) {
      searchRestaurants(text, searchQuery, appliedFilters);
    }
  }, [text, searchQuery, appliedFilters, searchRestaurants]);

  useEffect(() => {
    handleSearch();
  }, [text, appliedFilters, handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRemoveFilter = (filterToRemove: string) => {
    const newFilters = appliedFilters.filter(f => f !== filterToRemove);
    setAppliedFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <FilterPage />
        <div className="flex-1 space-y-6">
          {/* Search Input Field */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={searchQuery}
              placeholder="Search by restaurant & cuisines"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              className="bg-orange hover:bg-hoverOrange min-w-[100px]"
            >
              Search
            </Button>
          </div>

          {/* Results section */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h1 className="font-medium text-lg">
                {searchedRestaurants?.data?.length ?? 0} search result
                {searchedRestaurants?.data?.length !== 1 ? "s" : ""} found
              </h1>
              
              {appliedFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {appliedFilters.map((selectedFilter, idx) => (
                    <div key={idx} className="relative inline-flex items-center">
                      <Badge 
                        className="text-[#D19254] rounded-md hover:cursor-pointer pr-6 whitespace-nowrap" 
                        variant="outline"
                      >
                        {selectedFilter}
                      </Badge>
                      <button 
                        onClick={() => handleRemoveFilter(selectedFilter)}
                        className="absolute right-1 text-[#D19254] hover:text-[#b57d46]"
                        aria-label={`Remove filter ${selectedFilter}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Restaurant Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <SearchPageSkeleton />
              ) : !loading && searchedRestaurants?.data?.length === 0 ? (
                <NoResultFound searchText={text || ""} />
              ) : (
                searchedRestaurants?.data?.map((restaurant) => (
                  <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => (
  <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden 
                   hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out
                   flex flex-col h-full">
    <div className="relative">
      <AspectRatio ratio={16 / 9}>
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.restaurantName} 
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
      </AspectRatio>
      <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-3 py-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Featured
        </span>
      </div>
    </div>
    <CardContent className="p-4 flex-1">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
        {restaurant.restaurantName}
      </h1>
      <div className="space-y-2">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin size={16} className="flex-shrink-0" />
          <p className="text-sm ml-2">
            <span className="font-medium">{restaurant.city}</span>, {restaurant.country}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-4 flex-wrap">
        {restaurant.cuisines.map((cuisine, idx) => (
          <Badge 
            key={`${cuisine}-${idx}`} 
            className="font-medium px-2 py-1 rounded-full shadow-sm"
            variant="secondary"
          >
            {cuisine}
          </Badge>
        ))}
      </div>
    </CardContent>
    <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100">
      <Link 
        to={`/restaurant/${restaurant._id}`} 
        className="w-full"
        aria-label={`View menus for ${restaurant.restaurantName}`}
      >
        <Button className="w-full bg-orange hover:bg-hoverOrange font-semibold py-2 rounded-full shadow-md">
          View Menus
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

const SearchPageSkeleton = () => (
  <>
    {Array.from({ length: 6 }).map((_, index) => (
      <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <Skeleton className="w-full h-full" />
        </AspectRatio>
        <CardContent className="p-4">
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </CardContent>
        <CardFooter className="p-4">
          <Skeleton className="h-10 w-full rounded-full" />
        </CardFooter>
      </Card>
    ))}
  </>
);

interface NoResultFoundProps {
  searchText: string;
}

const NoResultFound = ({ searchText }: NoResultFoundProps) => (
  <div className="col-span-full text-center py-12">
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        No results found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        We couldn't find any results for "{searchText}". <br /> 
        Try searching with a different term.
      </p>
      <Link to="/">
        <Button className="bg-orange hover:bg-hoverOrange px-6">
          Go Back to Home
        </Button>
      </Link>
    </div>
  </div>
);

export default SearchPage;