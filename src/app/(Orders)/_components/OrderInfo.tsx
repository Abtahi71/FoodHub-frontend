"use client";
import { use, useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";

import { toast } from "sonner";
import {
  MapPin,
  Phone,
  CheckCircle,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkOutOrderAction,
  ClearCartAction,
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
  };
  quantity: number;
};

export default function OrderInfo() {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contact, setContact] = useState("");
  const [disable, setDisable] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: clearCart } = useMutation({
    mutationFn: ClearCartAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const { mutate: checkOutOrder, isPending } = useMutation({
    mutationFn: ({
      deliveryAddress,
      contact,
    }: {
      deliveryAddress: string;
      contact: string;
    }) => checkOutOrderAction(deliveryAddress, contact),
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      clearCart();
      setDisable(true);
      setOrderPlaced(true);
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  if (orderPlaced) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll deliver it soon.
          </p>
          <Link href="/">
            <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 px-8 py-3 rounded-xl font-semibold">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        {/* Header */}
        <div className="bg-background rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Complete Your Order
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Fill in your delivery details below
              </p>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-background rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              checkOutOrder({ deliveryAddress, contact });
            }}
            className="space-y-8"
          >
            {/* Delivery Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House no., Street, Area"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Phone className="h-5 w-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    +88
                  </span>
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="018XXXXXXXX"
                    className="w-full pl-12 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We'll use this number to contact you about your order
                </p>
              </div>
            </div>

            {/* Order Summary (Optional - you can add if you have cart data) */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>Will be calculated</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Delivery Fee</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-yellow-600">Calculated at checkout</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!deliveryAddress || !contact || isPending || disable}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg transition-all
                ${
                  !deliveryAddress || !contact || disable
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-400 text-gray-900 hover:bg-yellow-500 active:scale-[0.99]"
                }
              `}
            >
              {isPending ? "Placing Order..." : "Place Order"}
            </Button>

            {/* Trust Badge */}
            <p className="text-center text-xs text-gray-400 mt-4">
              🔒 Your information is secure and encrypted
            </p>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <button className="text-yellow-600 hover:text-yellow-700 font-medium">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
