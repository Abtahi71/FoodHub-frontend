"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import ProviderCard from "./ProviderCard";

import { ChevronRight, X, Filter, Utensils, Store } from "lucide-react";
import { getCategories, getCategoryProviders } from "@/services/category.service";
import { getProviders } from "@/services/provider.service";

export default function CategorySection() {
  const [meals, setMeals] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (e: any) {
        console.log(e);
        setCategories([]);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const AllProviders = async () => {
      const data = await getProviders();
      console.log(data);
      setProviders(data.data);
    };
    AllProviders();
  }, []);

  const handleClick = async (name: string) => {
    setLoading(true);
    setSelectedCategory(name);
    try {
      console.log("Fetching meals for:", name);
      const data = await getCategoryProviders(name);
      setMeals(data.result);
    } catch (e: any) {
      console.log(e);
      setMeals([]);
    }
    setLoading(false);
  };

  const clearSelection = () => {
    setSelectedCategory("");
    setMeals([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-600 mt-2">
          Browse by category or explore all restaurants
        </p>
      </div>

      {/* Category Pills */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {/* Clear Button - shows when category selected */}
          {selectedCategory && (
            <button
              onClick={clearSelection}
              className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}

          {/* Category Buttons */}
          {categories?.map((category: any) => (
            <button
              key={category.name}
              onClick={() => handleClick(category.name)}
              className={`
                px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200
                ${
                  selectedCategory === category.name
                    ? "bg-yellow-400 text-gray-900 shadow-md shadow-yellow-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {selectedCategory ? (
              <>
                <Utensils className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-gray-900">
                  <span className="text-yellow-600">{selectedCategory}</span>{" "}
                  Meals
                </h2>
              </>
            ) : (
              <>
                <Store className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-gray-900">
                  All Restaurants
                </h2>
              </>
            )}
          </div>

          {selectedCategory && (
            <button
              onClick={clearSelection}
              className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
            >
              View all restaurants
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse"
              >
                <div className="aspect-video w-full bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Selected Category View - Meals */}
            {selectedCategory ? (
              meals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {meals.map((meal: any, index) => (
                    <Link
                      key={`${meal.name}-${index}`}
                      href={`/provider/${meal.id}`}
                      className="block group"
                    >
                      <ProviderCard meal={meal} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                    <Utensils className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No meals found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No meals available in {selectedCategory} category
                  </p>
                  <button
                    onClick={clearSelection}
                    className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                  >
                    Browse all restaurants
                  </button>
                </div>
              )
            ) : /* All Restaurants View */
            providers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {providers.map((provider: any, index) => (
                    <Link
                      key={`${provider.id}-${index}`}
                      href={`/provider/${provider.id}`}
                      className="block group"
                    >
                      <ProviderCard meal={provider} />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Store className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No restaurants found
                </h3>
                <p className="text-gray-600">Please check back later</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
