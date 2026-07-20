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

  const { data, isLoading } = useQuery({
    queryKey: ["restaurants", searchTerm],
    queryFn: () => getRestaurantsAction(searchTerm),
  //  enabled: searchTerm.trim() !== "",
  });

  if(isLoading)return <div>Loading...</div>

  

  const restaurants = data?.data?.providers || [];
  const revenue = data?.data?.totalRevenue || 0;
  const length = restaurants?.length;

  console.log("THIS IS THE RESTAURANT IN PROVIDER PFOFILE", data);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your restaurants...</p>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mt-6 mb-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-background p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Total Restaurants</p>
          <p className="text-3xl font-bold text-gray-900">
            {restaurants.length}
          </p>
        </div>
        <div className="bg-background p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">
            {revenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-background p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Open Now</p>
          <p className="text-3xl font-bold text-green-600">
            {restaurants.filter((r: any) => r.isOpen).length}
          </p>
        </div>
        <div className="bg-background p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Closed</p>
          <p className="text-3xl font-bold text-gray-600">
            {restaurants.filter((r: any) => !r.isOpen).length}
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Restaurants</h1>
          <p className="text-gray-600 mt-2">
            Manage all your registered restaurants from one place
          </p>
        </div>

        {/* Add New Restaurant Button */}
        <div className="mb-6">
          <Link href="/provider">
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              + Add New Restaurant
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search restaurants by name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {restaurants.map((restaurant: any) => (
            <Card
              key={restaurant.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={restaurant.image || "/restaurant-placeholder.jpg"}
                  alt={restaurant.restaurantName}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={restaurant.isOpen ? "default" : "secondary"}
                    className={
                      restaurant.isOpen
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }
                  >
                    {restaurant.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {restaurant.restaurantName}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPinIcon className="w-4 h-4 mt-1 shrink-0" />
                  <p className="text-sm">{restaurant.address}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
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

              <CardFooter className="flex gap-3">
                <Link
                  href={`/ManageProvider/${restaurant.id}`}
                  className="flex-1"
                >
                  <Button
                    variant="default"
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    Manage
                  </Button>
                </Link>
                <Link
                  href={`/providerEdit/${restaurant.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    Edit
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
