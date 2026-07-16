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
} from "lucide-react";

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
  const [meals, setMeals] = useState<Meal[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (e: any) {
        console.log(e);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const data = await getMeals({
        search,
        category,
        ratings: rating,
        isAvailable,
        sortBy,
        sortOrder,
        page: "1",
        limit: "10",
      });

      setMeals(data.data.data);
     // toast.success("Meals loaded successfully 🍽️");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch meals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setRating("");
    setIsAvailable("");
    setSortBy("createdAt");
    setSortOrder("desc");
    fetchMeals();
  };

  const hasActiveFilters = search || category || rating || isAvailable;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Meals</h1>
        <p className="text-gray-600 mt-2">
          Find your next favorite dish from top restaurants
        </p>
      </div>

      {/* Search Bar - Always visible */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search for meals, cuisines, or restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-24 py-6 text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            onKeyDown={(e) => e.key === "Enter" && fetchMeals()}
          />
          <Button
            onClick={fetchMeals}
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-6"
            size="sm"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex items-center justify-between mb-4 lg:mb-0 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <Filter className="h-5 w-5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear all
            </button>
          )}
        </div>

        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Category Filter */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
              <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
              onClick={fetchMeals}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg py-2.5"
            >
              {loading ? "Loading..." : "Apply Filters"}
            </Button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                  Search: {search}
                  <button
                    onClick={() => setSearch("")}
                    className="hover:text-yellow-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                  {category}
                  <button
                    onClick={() => setCategory("")}
                    className="hover:text-yellow-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {rating && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                  {rating}+ Stars
                  <button
                    onClick={() => setRating("")}
                    className="hover:text-yellow-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {isAvailable && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                  {isAvailable === "true" ? "Available" : "Sold Out"}
                  <button
                    onClick={() => setIsAvailable("")}
                    className="hover:text-yellow-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{meals.length}</span> results
        </p>
      </div>

      {/* Meals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => {
            const avgRating = getAverageRating(meal.provider.reviews);

            return (
              <Link
                href={`/provider/${meal.provider.id}`}
                key={meal.id}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 hover:border-yellow-200 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-1">
                      {meal.meal.name}
                    </h3>
                    {!meal.isAvailable && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                    {meal.meal.description}
                  </p>

                  {/* Category & Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {meal.meal.category?.name}
                    </span>
                    {avgRating && (
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{avgRating}</span>
                      </span>
                    )}
                  </div>

                  {/* Restaurant & Price */}
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                      <Store className="h-3.5 w-3.5 inline mr-1 text-gray-400" />
                      {meal.provider.restaurantName}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-yellow-600">
                        ৳{meal.price}
                      </span>
                      <span className="text-xs text-gray-400">
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
      )}

      {/* Empty State */}
      {!loading && meals.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No meals found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or search for something else
          </p>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
