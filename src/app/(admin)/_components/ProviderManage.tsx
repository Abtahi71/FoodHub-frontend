"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProviderAdminAction } from "../_actions/admin.action";
import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Clock,
  Eye,
  Edit,
  MoreVertical,
  Filter,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";

type Provider = {
  id: string;
  restaurantName: string;
  isOpen: boolean;
  description: string;
  createdAt: string;
  image: string;
  avg_rating: string;
  order_count: number;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export default function ProviderManage() {
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const limit = 10;

  const handleOrderPageChange = (newPage: number) => {
    setPage(newPage);
  };

  const { data, isLoading,isFetching } = useQuery({
    queryKey: [
      "providerManage",
      sortBy,
      sortOrder,
      page,
      limit,
      searchTerm,
      minRating,
    ],
    queryFn: () =>
      getProviderAdminAction(
        sortBy,
        sortOrder,
        page,
        limit,
        searchTerm,
        minRating
      ),
    placeholderData: keepPreviousData,
  });

  const providers: Provider[] = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (isOpen: boolean) => {
    return isOpen
      ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
      : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400";
  };

  const getSortLabel = () => {
    const labels: Record<string, string> = {
      rating: "Rating",
      orderCount: "Orders",
      createdAt: "Joined Date",
    };
    return labels[sortBy] || sortBy;
  };

  const getRatingLabel = () => {
    if (minRating === 0) return "All Ratings";
    return `${minRating}+ Stars`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setMinRating(0);
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading providers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-4">
      {isFetching && <span className="text-xs text-gray-400">Updating…</span>}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Provider Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage all restaurant providers in the system
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none min-w-[200px]">
            <Input
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-4 pr-10 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-colors text-gray-900 dark:text-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setSortModalOpen(!sortModalOpen)}
            className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Sort</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline">
              ({getSortLabel()})
            </span>
          </button>

          {/* Rating Button */}
          <button
            onClick={() => setRatingModalOpen(!ratingModalOpen)}
            className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="hidden sm:inline">{getRatingLabel()}</span>
          </button>

          {/* Clear Filters */}
          {(searchTerm ||
            minRating > 0 ||
            sortBy !== "createdAt" ||
            sortOrder !== "desc") && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Sort Modal */}
      {sortModalOpen && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Sort Options
            </h3>
            <button
              onClick={() => setSortModalOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Sort By
              </p>
              <div className="space-y-1">
                {["rating", "orderCount", "createdAt"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setSortModalOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      sortBy === option
                        ? "bg-yellow-400 text-gray-900 dark:bg-yellow-500/20 dark:text-yellow-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {option === "rating" && "Rating"}
                    {option === "orderCount" && "Order Count"}
                    {option === "createdAt" && "Joined Date"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Order
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSortOrder("desc");
                    setSortModalOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    sortOrder === "desc"
                      ? "bg-yellow-400 text-gray-900 dark:bg-yellow-500/20 dark:text-yellow-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <SortDesc className="w-4 h-4" />
                  Newest / Most
                </button>
                <button
                  onClick={() => {
                    setSortOrder("asc");
                    setSortModalOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    sortOrder === "asc"
                      ? "bg-yellow-400 text-gray-900 dark:bg-yellow-500/20 dark:text-yellow-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <SortAsc className="w-4 h-4" />
                  Oldest / Least
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingModalOpen && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Filter by Rating
            </h3>
            <button
              onClick={() => setRatingModalOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => {
                  setMinRating(rating);
                  setRatingModalOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                  minRating === rating
                    ? "bg-yellow-400 text-gray-900 dark:bg-yellow-500/20 dark:text-yellow-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {rating}+{" "}
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              </button>
            ))}
            <button
              onClick={() => {
                setMinRating(0);
                setRatingModalOpen(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                minRating === 0
                  ? "bg-yellow-400 text-gray-900 dark:bg-yellow-500/20 dark:text-yellow-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All Ratings
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      <div className="flex items-center gap-2 flex-wrap">
        {searchTerm && (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs flex items-center gap-1">
            Search: {searchTerm}
            <button
              onClick={() => setSearchTerm("")}
              className="hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        {minRating > 0 && (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs flex items-center gap-1">
            {minRating}+ Stars
            <button
              onClick={() => setMinRating(0)}
              className="hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
          Sort: {getSortLabel()} ({sortOrder === "desc" ? "↓" : "↑"})
        </span>
      </div>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-3">
        {providers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              No providers found
            </p>
          </div>
        ) : (
          providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={provider.image}
                    alt={provider.restaurantName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {provider.restaurantName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {provider.description || "No description"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    provider.isOpen
                  )}`}
                >
                  {provider.isOpen ? "Open" : "Closed"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-900 dark:text-white">
                      {provider.avg_rating || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {provider.order_count}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Joined {formatDate(provider.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {providers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No providers found
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr
                    key={provider.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={provider.image}
                        alt={provider.restaurantName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {provider.restaurantName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          provider.isOpen
                        )}`}
                      >
                        {provider.isOpen ? "Open" : "Closed"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {provider.description || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {provider.avg_rating || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {provider.order_count}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(provider.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination?.totalPages >= 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} providers
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => handleOrderPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg border transition-colors ${
                pagination.hasPrevPage
                  ? "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  : "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                let pageNum = pagination.page;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handleOrderPageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === pageNum
                        ? "bg-yellow-400 text-gray-900 dark:bg-yellow-500/20 dark:text-yellow-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleOrderPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg border transition-colors ${
                pagination.hasNextPage
                  ? "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  : "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
