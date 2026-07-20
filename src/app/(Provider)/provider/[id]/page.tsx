"use client";
import ReviewSection from "@/app/(Provider)/_components/ReviewSection";

import React from "react";
import {
  MapPin,
  Clock,
  Star as StarIcon,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getProviderByIdAction } from "../../_actions/providerActions";
import MealSection from "../../_components/mealSection";
import { useParams } from "next/navigation";

export default function Provider() {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["providerById", id],
    queryFn: () => getProviderByIdAction(id as string),
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  const rating = data?.data?.averageRating;
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Failed to load restaurant details";

  const handleRetry = () => {
    refetch();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Skeleton */}
        <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
              <div className="h-10 md:h-12 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-full w-24"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-full w-24"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-full w-48"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            <div className="flex flex-wrap gap-2 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Meals Section Skeleton */}
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 animate-pulse"
                >
                  <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="max-w-7xl mx-auto px-4 mb-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-700 pb-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-12 px-6 bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Restaurant
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {errorMessage}
          </p>
          <button
            onClick={handleRetry}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    );
  }

  // Success State
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <img
          src={data?.data.image}
          alt={data?.data.restaurantName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Provider Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              {data?.data.restaurantName}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Rating */}
              <div className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 fill-gray-900" />
                <span className="font-semibold text-sm sm:text-base">
                  {rating ? rating.toFixed(1) : "New"}
                </span>
              </div>

              {/* Status */}
              <span
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-sm sm:text-base ${
                  data?.data.isOpen
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {data?.data.isOpen ? "Open Now" : "Closed"}
              </span>

              {/* Address */}
              <span className="flex items-center gap-2 text-white/90 text-sm sm:text-base">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {data?.data.address}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            About
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {data?.data.description ||
              "Experience delicious meals at this restaurant."}
          </p>

          {/* Cuisine Tags */}
          {data?.data.cuisineType && data?.data.cuisineType.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data?.data.cuisineType.map((cuisine: string) => (
                <span
                  key={cuisine}
                  className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-full text-sm"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meals Section */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <MealSection id={id} cuisineType={data?.data.cuisineType} />
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <ReviewSection id={id} />
      </div>

      {/* Background Refetch Indicator */}
      {isFetching && !isLoading && !isError && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700 flex items-center gap-2 z-50">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Updating...
          </span>
        </div>
      )}
    </div>
  );
}
