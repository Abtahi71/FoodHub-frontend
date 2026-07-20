"use client";
import { useEffect, useState, useMemo } from "react";

import MealCard from "./MealCard";
import {
  Utensils,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryMealsAction } from "@/_actions/category.action";

export default function MealSection({
  id,
  cuisineType,
}: {
  id: string;
  cuisineType: string[];
}) {
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data, isLoading } = useQuery({
    queryKey: ["category-meals", selectedCuisine],
    queryFn: () => getCategoryMealsAction(id, selectedCuisine || undefined),
  });

  const meals = data?.result || [];

  // Pagination logic
  const totalPages = Math.ceil(meals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMeals = meals.slice(startIndex, endIndex);

  // Reset page when cuisine changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCuisine]);

  const handleClick = async (name: string, providerId: string) => {
    setSelectedCuisine(name);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of meal section
    const mealSection = document.getElementById("meal-section");
    if (mealSection) {
      mealSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Generate page numbers
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        endPage = 4;
      }
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-8" id="meal-section">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-yellow-400 dark:text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Our Menu
          </h2>
        </div>
        {selectedCuisine && (
          <button
            onClick={() => {
              setSelectedCuisine("");
              setCurrentPage(1);
            }}
            className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 flex items-center gap-1 transition-colors"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Cuisine Tabs - Responsive */}
      {cuisineType && cuisineType.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cuisineType.map((cuisine: string) => (
            <button
              key={cuisine}
              onClick={() => handleClick(cuisine, id)}
              className={`
                px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm
                sm:px-5 sm:py-2.5 sm:text-base
                ${
                  selectedCuisine === cuisine
                    ? "bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 shadow-md shadow-yellow-200/50 dark:shadow-yellow-500/30"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              {cuisine}
            </button>
          ))}
        </div>
      )}

      {/* Meals Grid */}
      <div className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 animate-pulse"
              >
                <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : currentMeals.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentMeals.map((item: any, index: any) => (
                <MealCard
                  key={`${item.id}-${index}`}
                  meal={item}
                  mealId={item.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${
                      currentPage === 1
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {pageNumbers.map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" && handlePageChange(page)
                    }
                    disabled={typeof page !== "number"}
                    className={`
                      min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 text-sm
                      ${
                        page === currentPage
                          ? "bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 shadow-md shadow-yellow-200/50 dark:shadow-yellow-500/30"
                          : typeof page === "number"
                          ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          : "text-gray-400 dark:text-gray-600 cursor-default"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${
                      currentPage === totalPages
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Items count */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Showing {startIndex + 1}-{Math.min(endIndex, meals.length)} of{" "}
              {meals.length} meals
            </div>
          </>
        ) : selectedCuisine ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Utensils className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No meals found in {selectedCuisine}
            </p>
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Utensils className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Select a category to see meals
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
