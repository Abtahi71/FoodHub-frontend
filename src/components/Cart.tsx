"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Link from "next/link";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ClearCartAction,
  GetCartAction,
} from "@/app/(Orders)/_actions/order.action";

type CartItem = {
  providerMeal: {
    meal: {
      name: string;
      description: string;
    };
    provider: {
      restaurantName: string;
    };
    price: number;
    image?: string;
  };
  quantity: number;
};

export default function Cart() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: GetCartAction,
  });

  const items = cart?.data?.cart?.items ?? [];
  const totalAmount = cart?.data?.totalAmount ?? 0;
  const id = cart?.data?.cart?.id ?? "";

  const { mutate: ClearCart, isPending } = useMutation({
    mutationFn: ClearCartAction,
    onSuccess: () => {
      toast.success("Cart cleared successfully");
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: () => {
      toast.error("Failed to clear cart");
    },
  });

  const itemCount = items?.length;

  return (
    <div>
      {/* Cart Icon */}
      <div
        className="relative cursor-pointer group"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        <div className="p-2 rounded-full hover:bg-yellow-50 transition-colors">
          <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-yellow-600" />
        </div>
        {itemCount > 0 && (
          <p className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </p>
        )}
      </div>

      {/* Cart Modal */}
      {isModalOpen && (
        <div className="fixed mt-100 inset-0 z-51 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Cart
                </h2>
                {itemCount > 0 && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                    {itemCount} items
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="p-4">
              {items?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                    <ShoppingCart className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="text-gray-600">Your cart is empty</p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                  >
                    Browse Meals
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items?.map((item: any, index: any) => (
                    <div
                      key={index}
                      className="flex gap-4 p-3 border border-gray-100 rounded-lg"
                    >
                      {/* Item Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                        <img
                          src={
                            item.providerMeal.image || "/placeholder-food.png"
                          }
                          alt={item.providerMeal.meal.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.providerMeal.meal.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.providerMeal.provider.restaurantName}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-medium text-yellow-600">
                              ৳{item.providerMeal.price}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ৳{item.providerMeal.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  {items?.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-yellow-600">৳{totalAmount}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {items?.length > 0 && (
              <div className="sticky bottom-0 bg-background border-t border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/checkOut/${id}`} className="flex-1">
                    <Button
                      className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-semibold py-6"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => ClearCart()}
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 py-6"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
