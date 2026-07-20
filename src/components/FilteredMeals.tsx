"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCategories, getMeals } from "@/services/category.service";
import { toast } from "sonner";
import Link from "next/link";
import {
  Search,
  Star,
  Filter,
  ArrowUpDown,
  X,
  Clock,
  DollarSign,
  Store,
  Tag,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { getCategoriesAction } from "@/_actions/category.action";
import { useQuery } from "@tanstack/react-query";

type Meal = {
  id: string;
  price: number;
  isAvailable: boolean;
  meal: {
    name: string;
    description: string;
    category: {
      name: string;
    };
  };
  provider: {
    id: string;
    restaurantName: string;
    reviews: {
      rating: number;
    }[];
  };
};

export default function FilteredMealCard() {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Categories Query
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["category"],
    queryFn: getCategoriesAction,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  // Meals Query
  const {
    data: mealsData,
    isLoading: isMealsLoading,
    isError: isMealsError,
    error: mealsError,
    refetch: refetchMeals,
    isFetching,
  } = useQuery({
    queryKey: [
      "meals",
      submittedSearch,
      category,
      rating,
      isAvailable,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      getMeals({
        search: submittedSearch,
        category,
        ratings: rating,
        isAvailable,
        sortBy,
        sortOrder,
        page: "1",
        limit: "10",
      }),
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesData?.categories || [];
  const meals = mealsData?.data?.data || [];
  const isCategoriesErrorMsg =
    categoriesError instanceof Error
      ? categoriesError.message
      : "Failed to load categories";
  const isMealsErrorMsg =
    mealsError instanceof Error ? mealsError.message : "Failed to load meals";

  const handleSearch = () => {
    setSubmittedSearch(search);
  };

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSubmittedSearch("");
    setCategory("");
    setRating("");
    setIsAvailable("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setShowFilters(false);
  };

  const handleRetry = () => {
    refetchMeals();
    refetchCategories();
  };

  const hasActiveFilters = submittedSearch || category || rating || isAvailable;

  // Loading Skeleton for Categories
  const CategorySkeleton = () => (
    <div className="relative">
      <div className="h-[46px] w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    </div>
  );

  // Loading Skeleton for Meals
  const MealsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 animate-pulse"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error Display Component
  const ErrorDisplay = ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry: () => void;
  }) => (
    <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
        {message}
      </p>
      <button
        onClick={onRetry}
        disabled={isFetching}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-600 dark:bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-700 dark:hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isFetching ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Retrying...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Try Again
          </>
        )}
      </button>
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
        <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No meals found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Try adjusting your filters or search for something else
      </p>
      <Button
        onClick={clearFilters}
        variant="outline"
        className="border-yellow-200 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-500/10"
      >
        Clear all filters
      </Button>
    </div>
  );

  // Loading state for entire page
  if (isCategoriesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
        </div>
        <div className="mb-6">
          <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </div>
        <MealsSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Discover Meals
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Find your next favorite dish from top restaurants
        </p>
      </div>

      {/* Search Bar - Always visible */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
          <Input
            placeholder="Search for meals, cuisines, or restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="pl-10 pr-24 py-6 text-base border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent"
          />
          <Button
            onClick={handleSearch}
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white rounded-lg px-4 sm:px-6"
            size="sm"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
        <div className="flex items-center justify-between mb-4 lg:mb-0 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
          >
            <Filter className="h-5 w-5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear all
            </button>
          )}
        </div>

        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Category Filter */}
            {isCategoriesError ? (
              <div className="text-sm text-red-600 dark:text-red-400 col-span-full">
                Failed to load categories
              </div>
            ) : (
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <select
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isCategoriesLoading}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rating Filter */}
            <div className="relative">
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <select
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div className="relative">
              <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <select
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent"
                value={isAvailable}
                onChange={(e) => setIsAvailable(e.target.value)}
              >
                <option value="">All</option>
                <option value="true">Available Now</option>
                <option value="false">Sold Out</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <select
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent"
                value={`${sortBy},${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split(",");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
              >
                <option value="createdAt,desc">Newest First</option>
                <option value="createdAt,asc">Oldest First</option>
                <option value="price,desc">Price: High to Low</option>
                <option value="price,asc">Price: Low to High</option>
              </select>
            </div>

            {/* Apply Button */}
            <Button
              onClick={handleSearch}
              disabled={isMealsLoading}
              className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white rounded-lg py-2.5"
            >
              {isMealsLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Apply Filters"
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Active filters:
              </span>
              {submittedSearch && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-sm">
                  Search: {submittedSearch}
                  <button
                    onClick={() => {
                      setSearch("");
                      setSubmittedSearch("");
                    }}
                    className="hover:text-yellow-900 dark:hover:text-yellow-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-sm">
                  {category}
                  <button
                    onClick={() => setCategory("")}
                    className="hover:text-yellow-900 dark:hover:text-yellow-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {rating && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-sm">
                  {rating}+ Stars
                  <button
                    onClick={() => setRating("")}
                    className="hover:text-yellow-900 dark:hover:text-yellow-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {isAvailable && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-sm">
                  {isAvailable === "true" ? "Available" : "Sold Out"}
                  <button
                    onClick={() => setIsAvailable("")}
                    className="hover:text-yellow-900 dark:hover:text-yellow-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      {!isMealsError && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {meals?.length}
            </span>{" "}
            results
          </p>
        </div>
      )}

      {/* Meals Grid with Error and Loading States */}
      <div>
        {/* Loading State */}
        {isMealsLoading && <MealsSkeleton />}

        {/* Error State */}
        {isMealsError && (
          <ErrorDisplay message={isMealsErrorMsg} onRetry={handleRetry} />
        )}

        {/* Success State */}
        {!isMealsLoading && !isMealsError && (
          <>
            {meals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {meals.map((meal: any) => {
                  const avgRating = getAverageRating(meal.provider.reviews);

                  return (
                    <Link
                      href={`/provider/${meal.provider.id}`}
                      key={meal.id}
                      className="group"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:shadow-md transition-all duration-200 hover:border-yellow-200 dark:hover:border-yellow-500/30 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-1">
                            {meal.meal.name}
                          </h3>
                          {!meal.isAvailable && (
                            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                              Sold Out
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                          {meal.meal.description}
                        </p>

                        {/* Category & Rating */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {meal.meal.category?.name}
                          </span>
                          {avgRating && (
                            <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{avgRating}</span>
                            </span>
                          )}
                        </div>

                        {/* Restaurant & Price */}
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                            <Store className="h-3.5 w-3.5 inline mr-1 text-gray-400 dark:text-gray-500" />
                            {meal.provider.restaurantName}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-400">
                              ৳{meal.price}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {meal.provider.reviews.length} review
                              {meal.provider.reviews.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </div>

      {/* Background Refetch Indicator */}
      {isFetching && !isMealsLoading && !isMealsError && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Updating...
          </span>
        </div>
      )}
    </div>
  );
}
