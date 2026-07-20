"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Clock,
  MapPin,
  Phone,
  Store,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getMyOrderAction } from "../_actions/order.action";
import { useQuery } from "@tanstack/react-query";

interface OrderItem {
  Providermeal: {
    price: number;
    meal?: {
      name: string;
      description?: string;
      image?: string;
    };
  };
  quantity: number;
}

interface Order {
  id: string;
  totalAmount: number;
  createdAt: string;
  status: string;
  deliveryAddress?: string;
  contact?: string;
  paymentMethod?: string;
  provider: {
    restaurantName: string;
  };
  items: OrderItem[];
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PREPARING: "bg-blue-100 text-blue-800 border-blue-200",
  ON_THE_WAY: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  PENDING: <Clock className="h-4 w-4" />,
  PREPARING: <Package className="h-4 w-4" />,
  ON_THE_WAY: <Package className="h-4 w-4" />,
  DELIVERED: <Package className="h-4 w-4" />,
  CANCELLED: <Package className="h-4 w-4" />,
};

export default function MyOrders() {
 
 
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  const {data:orders,isLoading,isError} = useQuery({
    queryKey: ["orders"],
    queryFn: getMyOrderAction
  });



  





  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP p");
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="bg-gray-50 dark:bg-gray-900">
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!orders?.data || orders?.data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
          <Card className="p-12">
            <div className="flex flex-col items-center gap-4">
              <Package className="h-16 w-16 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-700">
                No orders yet
              </h2>
              <p className="text-gray-500 mb-4">
                Looks like you haven't placed any orders.
              </p>
              <Button
                asChild
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              >
                <a href="/">Browse Restaurants</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Badge variant="outline" className="text-sm">
            {orders?.data.length}{" "}
            {orders?.data.length === 1 ? "Order" : "Orders"}
          </Badge>
        </div>

        <div className="space-y-6">
          {orders?.data.map((order: any) => (
            <Card
              key={order.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Order Header */}
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-yellow-600" />
                      <CardTitle className="text-lg">
                        {order?.provider?.restaurantName || "Restaurant"}
                      </CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatDate(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`px-3 py-1 text-sm font-medium border ${
                        statusColors[
                          order.status as keyof typeof statusColors
                        ] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {statusIcons[order.status as keyof typeof statusIcons]}
                        {order.status?.replace("_", " ") || "PENDING"}
                      </span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderExpand(order.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedOrders.includes(order.id) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(order?.totalAmount)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Items</p>
                    <p className="text-lg font-bold text-gray-900">
                      {order?.items?.reduce(
                        (sum: any, item: any) => sum + item.quantity,
                        0
                      ) || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Payment</p>
                    <p className="text-sm font-medium text-gray-700">
                      {order?.paymentMethod || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="text-xs font-mono text-gray-600 truncate">
                      {order.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                {/* Contact & Delivery Info */}
                {(order?.deliveryAddress || order?.contact) && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {order?.deliveryAddress && (
                        <div className="flex items-start gap-2 flex-1">
                          <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-blue-600 font-medium">
                              Delivery Address
                            </p>
                            <p className="text-sm text-gray-700">
                              {order?.deliveryAddress}
                            </p>
                          </div>
                        </div>
                      )}
                      {order?.contact && (
                        <div className="flex items-start gap-2 flex-1">
                          <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-blue-600 font-medium">
                              Contact
                            </p>
                            <p className="text-sm text-gray-700">
                              {order?.contact}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {expandedOrders.includes(order?.id) && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {order?.items?.map((item: any, index: any) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {/* Item Image Placeholder */}
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {item.Providermeal?.meal?.name || "Item"}
                              </p>
                              {item.Providermeal?.meal?.description && (
                                <p className="text-xs text-gray-500 line-clamp-1">
                                  {item.Providermeal.meal.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  Qty: {item.quantity}
                                </Badge>
                                <span className="text-xs text-gray-400">×</span>
                                <span className="text-xs font-medium text-gray-700">
                                  {formatCurrency(item.Providermeal.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(
                                item.Providermeal.price * item.quantity
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(item.Providermeal.price)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Order Footer */}
              <CardFooter className="bg-gray-50 border-t flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Order placed on {formatDate(order.createdAt)}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
