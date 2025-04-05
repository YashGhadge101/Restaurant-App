import { Link, useParams } from "react-router-dom";
import FilterPage from "./FilterPage";
import { Input } from "./ui/input";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Globe, MapPin, Timer, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { Restaurant } from "../types/restaurantType";
import { useDebounce } from "../hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";

const SearchPage = () => {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    loading,
    searchedRestaurant,
    searchRestaurant,
    setAppliedFilter,
    appliedFilter,
    resetAppliedFilter
  } = useRestaurantStore();

  const handleSearch = useCallback(async () => {
    try {
      setError(null);
      await searchRestaurant(
        params.text || "", 
        debouncedSearchQuery, 
        appliedFilter
      );
    } catch (err) {
      setError("Failed to fetch restaurants. Please try again.");
      console.error("Search error:", err);
    }
  }, [params.text, debouncedSearchQuery, appliedFilter, searchRestaurant]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleFilterRemove = (filterToRemove: string) => {
    setAppliedFilter(filterToRemove);
  };

  const handleClearAllFilters = () => {
    resetAppliedFilter();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto my-10 px-4"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row justify-between gap-10"
      >
        <FilterPage />
        
        <motion.div 
          variants={itemVariants}
          className="flex-1"
        >
          {/* Search Input Field */}
          <motion.div 
            className="flex items-center gap-2 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              type="text"
              value={searchQuery}
              placeholder="Search by restaurant & cuisines"
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search restaurants"
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              className="bg-orange hover:bg-hoverOrange"
              aria-label="Perform search"
              asChild
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Search
              </motion.div>
            </Button>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Applied Filters */}
          <AnimatePresence>
            {appliedFilter.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-medium">Applied Filters:</h2>
                  <Button 
                    variant="ghost" 
                    onClick={handleClearAllFilters}
                    className="text-orange hover:text-hoverOrange"
                    asChild
                  >
                    <motion.div whileHover={{ scale: 1.05 }}>
                      Clear All
                    </motion.div>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {appliedFilter.map((filter: string, idx: number) => (
                    <motion.div
                      key={`${filter}-${idx}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative inline-flex items-center max-w-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        className="text-[#D19254] rounded-md hover:cursor-pointer pr-6 whitespace-nowrap"
                        variant="outline"
                      >
                        {filter}
                      </Badge>
                      <button
                        onClick={() => handleFilterRemove(filter)}
                        aria-label={`Remove ${filter} filter`}
                        className="absolute right-1 text-[#D19254] hover:text-hoverOrange"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-4"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-medium text-lg">
                {searchedRestaurant?.data.length || 0} results found
                {params.text && ` for "${params.text}"`}
              </h1>
            </motion.div>

            {/* Restaurant Cards */}
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {loading ? (
                <SearchPageSkeleton />
              ) : error ? (
                <NoResultFound searchText={params.text || ""} />
              ) : searchedRestaurant?.data.length === 0 ? (
                <NoResultFound searchText={params.text || searchQuery || ""} />
              ) : (
                <AnimatePresence>
                  {searchedRestaurant?.data.map((restaurant: Restaurant, index: number) => (
                    <motion.div
                      key={restaurant._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <RestaurantCard restaurant={restaurant} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Restaurant Card Component with Animations
const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <motion.img
            src={restaurant.imageUrl}
            alt={`${restaurant.restaurantName} restaurant`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            onError={(e) => {
              (e.currentTarget.src = '/restaurant-fallback.jpg');
            }}
          />
        </AspectRatio>
        <motion.div 
          className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-3 py-1"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Featured
          </span>
        </motion.div>
      </div>
      <CardContent className="p-4 flex-grow">
        <motion.h1 
          className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {restaurant.restaurantName}
        </motion.h1>
        <div className="space-y-2">
          <motion.div 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <MapPin size={16} />
            <p className="text-sm">
              {restaurant.city}, {restaurant.country}
            </p>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Timer size={16} />
            <p className="text-sm">
              Delivery: {restaurant.deliveryTime} mins
            </p>
          </motion.div>
        </div>
        <motion.div 
          className="flex gap-2 mt-4 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {restaurant.cuisines.map((cuisine: string, idx: number) => (
            <Badge
              key={`${cuisine}-${idx}`}
              className="font-medium px-2 py-1 rounded-full shadow-sm"
              variant="secondary"
            >
              {cuisine}
            </Badge>
          ))}
        </motion.div>
      </CardContent>
      <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 flex justify-end">
        <Link to={`/restaurant/${restaurant._id}`}>
          <Button 
            className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200"
            aria-label={`View menus for ${restaurant.restaurantName}`}
            asChild
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Menus
            </motion.div>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
);

const SearchPageSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
            <div className="relative">
              <AspectRatio ratio={16 / 6}>
                <Skeleton className="w-full h-full" />
              </AspectRatio>
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="mt-2 flex gap-1 items-center text-gray-600 dark:text-gray-400">
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
            <CardFooter className="p-4 dark:bg-gray-900 flex justify-end">
              <Skeleton className="h-10 w-24 rounded-full" />
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </>
  );
};

const NoResultFound = ({ searchText }: { searchText: string }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring" }}
      className="text-center col-span-3 py-10"
    >
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        No results found
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        We couldn't find any results for "{searchText}". <br /> Try searching
        with a different term.
      </p>
      <Link to="/">
        <Button 
          className="mt-4 bg-orange hover:bg-orangeHover"
          asChild
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back to Home
          </motion.div>
        </Button>
      </Link>
    </motion.div>
  );
};

export default SearchPage;