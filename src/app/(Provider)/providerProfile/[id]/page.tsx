"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  MapPinIcon,
  BuildingIcon,
  SearchIcon,
  AlertCircle,
  RefreshCw,
  Loader2,
  Store,
  DollarSign,
  Clock,
  XCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth";

import { useQuery } from "@tanstack/react-query";
import { getRestaurantsAction } from "../../_actions/providerActions";

type Restaurant = {
  id: string;
  restaurantName: string;
  address: string;
  isOpen: boolean;
  image: string;
  createdAt: string;
};

export default function ProviderDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["restaurants", searchTerm],
    queryFn: () => getRestaurantsAction(searchTerm),
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const restaurants = data?.data?.providers || [];
  const revenue = data?.data?.totalRevenue || 0;
  const openRestaurants = restaurants.filter((r: any) => r.isOpen);
  const closedRestaurants = restaurants.filter((r: any) => !r.isOpen);

  const errorMessage =
    error instanceof Error ? error.message : "Failed to load restaurants";

  const handleRetry = () => {
    refetch();
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="h-48 w-full bg-gray-200 dark:bg-gray-700"></div>
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Stats Cards Skeleton
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm animate-pulse"
        >
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );

  // Error Display
  const ErrorDisplay = () => (
    <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Failed to Load Restaurants
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
        {errorMessage}
      </p>
      <button
        onClick={handleRetry}
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
    <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
          <Store className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No Restaurants Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {searchTerm
          ? `No restaurants match "${searchTerm}"`
          : "You haven't registered any restaurants yet"}
      </p>
      <Link href="/provider">
        <Button className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400">
          + Add Your First Restaurant
        </Button>
      </Link>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
          </div>
          <div className="mb-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          </div>
          <StatsSkeleton />
          <div className="mt-8">
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Restaurants
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage all your registered restaurants from one place
          </p>
        </div>

        {/* Add New Restaurant Button */}
        <div className="mb-6">
          <Link href="/provider">
            <Button className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white">
              + Add New Restaurant
            </Button>
          </Link>
        </div>

        {/* Stats Cards - Responsive Grid */}
        {!isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Restaurants
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {restaurants.length}
                  </p>
                </div>
                <Store className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    ${revenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Open Now
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-500">
                    {openRestaurants.length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Closed
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-400">
                    {closedRestaurants.length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-gray-600 dark:text-gray-500" />
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search restaurants by name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Error State */}
        {isError && <ErrorDisplay />}

        {/* Content */}
        {!isError && (
          <>
            {restaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant: any) => (
                  <Card
                    key={restaurant.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                    <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={restaurant.image || "/restaurant-placeholder.jpg"}
                        alt={restaurant.restaurantName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={restaurant.isOpen ? "default" : "secondary"}
                          className={
                            restaurant.isOpen
                              ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                              : "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                          }
                        >
                          {restaurant.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        {restaurant.restaurantName}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <MapPinIcon className="w-4 h-4 mt-1 shrink-0" />
                        <p className="text-sm">{restaurant.address}</p>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4 shrink-0" />
                        <p className="text-sm">
                          Joined{" "}
                          {new Date(restaurant.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/ManageProvider/${restaurant.id}`}
                        className="w-full"
                      >
                        <Button
                          variant="default"
                          className="w-full bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white"
                        >
                          Manage
                        </Button>
                      </Link>
                      <Link
                        href={`/providerEdit/${restaurant.id}`}
                        className="w-full"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Edit
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}

        {/* Background Refetch Indicator */}
        {isFetching && !isLoading && !isError && (
          <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Updating...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
