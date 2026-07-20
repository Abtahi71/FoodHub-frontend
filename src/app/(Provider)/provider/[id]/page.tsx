"use client";
import { useEffect, useState, useMemo } from "react";

import MealCard from "./MealCard";
import {
  Utensils,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  AlertCircle,
  RefreshCw,
  Loader2,
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

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["category-meals", selectedCuisine, id],
    queryFn: () => getCategoryMealsAction(id, selectedCuisine || undefined),
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const meals = data?.result || [];
  const errorMessage =
    error instanceof Error ? error.message : "Failed to load meals";

  // Pagination logic
  const totalPages = Math.ceil(meals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMeals = meals.slice(startIndex, endIndex);

  // Reset page when cuisine changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCuisine]);

  const handleCuisineClick = async (name: string) => {
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

  const handleRetry = () => {
    refetch();
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

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 animate-pulse"
          >
            <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
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
        {errorMessage}
      </p>
      <button
        onClick={handleRetry}
        disabled={isFetching}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-400 dark:bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

  // Empty state
  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
          <Utensils className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );

  return (
    <div className="space-y-8" id="meal-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-yellow-400 dark:text-yellow-500 flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Our Menu
          </h2>
          {selectedCuisine && (
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {selectedCuisine}
            </span>
          )}
        </div>
        {selectedCuisine && !isLoading && !isError && (
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
      {cuisineType && cuisineType.length > 0 && !isError && (
        <div className="flex flex-wrap gap-2">
          {cuisineType.map((cuisine: string) => (
            <button
              key={cuisine}
              onClick={() => handleCuisineClick(cuisine)}
              disabled={isLoading}
              className={`
                px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm
                sm:px-5 sm:py-2.5 sm:text-base
                ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }
                ${
                  selectedCuisine === cuisine
                    ? "bg-yellow-400 dark:bg-yellow-500 text-gray-900 shadow-md shadow-yellow-200/50 dark:shadow-yellow-500/30"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              {cuisine}
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="mt-6">
        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Error State */}
        {isError && <ErrorDisplay />}

        {/* Success State */}
        {!isLoading && !isError && (
          <>
            {currentMeals.length > 0 ? (
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
                  <div className="flex flex-col items-center gap-3 mt-8">
                    <div className="flex flex-wrap items-center justify-center gap-2">
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
                        aria-label="Previous page"
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
                                ? "bg-yellow-400 dark:bg-yellow-500 text-gray-900 shadow-md shadow-yellow-200/50 dark:shadow-yellow-500/30"
                                : typeof page === "number"
                                ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                : "text-gray-400 dark:text-gray-600 cursor-default"
                            }
                          `}
                          aria-label={
                            typeof page === "number"
                              ? `Go to page ${page}`
                              : "More pages"
                          }
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
                        aria-label="Next page"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Items count */}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Showing{" "}
                      <span className="font-medium">{startIndex + 1}</span> -{" "}
                      <span className="font-medium">
                        {Math.min(endIndex, meals.length)}
                      </span>{" "}
                      of <span className="font-medium">{meals.length}</span>{" "}
                      meals
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                message={
                  selectedCuisine
                    ? `No meals found in "${selectedCuisine}"`
                    : "Select a category to see meals"
                }
              />
            )}
          </>
        )}
      </div>

      {/* Refetch indicator for background updates */}
      {isFetching && !isLoading && (
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
