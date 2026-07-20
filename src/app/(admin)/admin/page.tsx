"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllOrdersAction,
  getAllUsersAction,
  updateUserStatusAction,
} from "../_actions/admin.action";
import ProviderManage from "../_components/ProviderManage";

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState("");

  const limit = 10;

  const [showFilters, setShowFilters] = useState(false);

  const { data: usersData, isLoading } = useQuery({
    queryKey: [
      "users",
      searchTerm,
      roleFilter,
      activeFilter,
      page,
      limit,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      getAllUsersAction({
        page,
        limit,
        search: searchTerm || undefined,
        userRole: roleFilter || undefined,
        userSortBy: sortBy || undefined,
        userSortOrder: sortOrder,
        isActive: activeFilter === "" ? undefined : activeFilter === "active",
      }),
  });

  const users = usersData?.data.userWithOrderCounts ?? [];
  const pagination = usersData?.data.pagination;

  const { data: ordersData, isLoading: isOrderLoading } = useQuery({
    queryKey: ["orders", orderPage, limit],
    queryFn: () =>
      getAllOrdersAction({
        page: orderPage,
        limit,
      }),
  });

  const orders = ordersData?.data.orders ?? [];
  const orderPagination = ordersData?.data.pagination;

  const applyFilters = () => {
    setPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setActiveFilter("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleOrderPageChange = (newPage: number) => {
    setOrderPage(newPage);
  };

  const queryClient = useQueryClient();

  const handleUserStatus = (user: any) => {
    updateUserStatus({
      userId: user.id,
      status: user.isActive ? "false" : "true",
    });
  };

  const { mutate: updateUserStatus, isPending } = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      updateUserStatusAction(userId, status),

    onSuccess: () => {
      toast.success("User status updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-background rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  User Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-200 mt-1">
                  Total users: {pagination?.total}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {(searchTerm || roleFilter || activeFilter) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search by name or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">All Roles</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="PROVIDER">Provider</option>
                    <option value="ADMIN">Admin</option>
                  </select>

                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Orders
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Member Since
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-5 w-5 animate-spin text-yellow-400" />
                        <span className="text-gray-500">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users?.map((user: any) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="p-4 font-medium">{user.name}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-200">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                          ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "PROVIDER"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleUserStatus(user)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors
                            ${
                              user.isActive
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isActive ? "bg-green-600" : "bg-red-600"
                            }`}
                          />
                          {user.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="p-4 font-semibold text-yellow-600">
                        {user.orderCount || 0}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-200">
                        {Math.floor(
                          (Date.now() - new Date(user.createdAt).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination?.totalPages >= 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {(pagination?.page - 1) * pagination?.limit + 1} to{" "}
                {Math.min(
                  pagination?.page * pagination?.limit,
                  pagination?.total
                )}{" "}
                of {pagination?.total} users
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination?.page - 1)}
                  disabled={!pagination?.hasPrevPage}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg border transition-colors ${
                    pagination?.hasPrevPage
                      ? "border-gray-300 text-gray-700 dark:bg-gray-100 hover:bg-gray-50"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, pagination?.totalPages))].map(
                    (_, i) => {
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
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            pagination.page === pageNum
                              ? "bg-yellow-400 text-gray-900 dark:text-gray-100"
                              : "text-gray-600 dark:text-gray-100 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg border transition-colors ${
                    pagination.hasNextPage
                      ? "border-gray-300 text-gray-700 dark:bg-gray-100 hover:bg-gray-50"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <ProviderManage />
        </div>

        <div className="bg-background rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Order Management
            </h1>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Customer
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Contact
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Provider
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Ordered At
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-gray-500 dark:text-gray-200"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders?.map((order: any) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="p-4 font-medium">
                        {order.customer?.name}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-200">
                        {order.contact}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-200">
                        {order.provider?.restaurantName}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-200">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-4 font-semibold text-yellow-600">
                        ৳{order.totalAmount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {orderPagination?.totalPages >= 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-600 dark:text-gray-100">
                Showing {(orderPagination.page - 1) * orderPagination.limit + 1}{" "}
                to{" "}
                {Math.min(
                  orderPagination.page * orderPagination.limit,
                  orderPagination.total
                )}{" "}
                of {orderPagination.total} orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleOrderPageChange(orderPagination.page - 1)
                  }
                  disabled={!orderPagination.hasPrevPage}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg border transition-colors ${
                    orderPagination.hasPrevPage
                      ? "border-gray-300 text-gray-700 dark:text-gray-100 hover:bg-gray-50"
                      : "border-gray-200 text-gray-400 dark:text-gray-100 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, orderPagination.totalPages))].map(
                    (_, i) => {
                      let pageNum = orderPagination.page;
                      if (orderPagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (orderPagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (
                        orderPagination.page >=
                        orderPagination.totalPages - 2
                      ) {
                        pageNum = orderPagination.totalPages - 4 + i;
                      } else {
                        pageNum = orderPagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handleOrderPageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            orderPagination.page === pageNum
                              ? "bg-yellow-400 text-gray-900 dark:bg-gray-100 "
                              : "text-gray-600 dark:text-gray-100 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    handleOrderPageChange(orderPagination.page + 1)
                  }
                  disabled={!orderPagination.hasNextPage}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg border transition-colors ${
                    orderPagination.hasNextPage
                      ? "border-gray-300 text-gray-700  dark:bg-gray-100 hover:bg-gray-50"
                      : "border-gray-200 text-gray-400 dark:bg-gray-100 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
