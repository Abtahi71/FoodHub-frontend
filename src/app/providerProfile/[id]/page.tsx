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
import { CalendarIcon, MapPinIcon, BuildingIcon, SearchIcon } from "lucide-react";
import { authClient } from "@/lib/auth";
import { getRestaurants } from "@/services/provider.service";


type Restaurant = {
  id: string;
  restaurantName: string;
  address: string;
  isOpen: boolean;
  image: string;
  createdAt: string;
};

export default function ProviderDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [revenue, setRevenue] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (user?.id) return;

      try {
        
        const data = await getRestaurants(searchTerm);
        console.log(data)
        console.log('This is the data',data.data.providers)
        setRestaurants(data.data.providers || []);
        setRevenue(data.data.totalRevenue);
        

      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } 
    };

    fetchRestaurants();
  }, [searchTerm]);

  

  const handleSearch = async () => {
    //setLoading(true);
    try {
      console.log(searchTerm)
      const data = await getRestaurants(searchTerm);
      setRestaurants(data.data.providers || []);
      console.log('This is the data',data.data.providers)
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
    }finally{
      setLoading(false);
    }
    
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your restaurants...</p>
        </div>
      </div>
    );
  }

  // if (!restaurants.length && !length) {
  //   return (
      
  //     <div className="min-h-screen flex items-center justify-center">
        
  //       <div className="text-center max-w-md mx-auto p-6">
  //         <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
  //           <BuildingIcon className="w-12 h-12 text-gray-400" />
  //         </div>
  //         <h2 className="text-2xl font-semibold mb-2">No restaurants yet</h2>
  //         <p className="text-gray-600 mb-6">
  //           You haven't registered any restaurants. Start by adding your first
  //           restaurant!
  //         </p>
  //         <Link href="/provider/register">
  //           <Button className="bg-yellow-600 hover:bg-yellow-700">
  //             Register Your First Restaurant
  //           </Button>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mt-6 mb-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Total Restaurants</p>
          <p className="text-3xl font-bold text-gray-900">
            {restaurants.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">
            {revenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Open Now</p>
          <p className="text-3xl font-bold text-green-600">
            {restaurants.filter((r) => r.isOpen).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Closed</p>
          <p className="text-3xl font-bold text-gray-600">
            {restaurants.filter((r) => !r.isOpen).length}
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
              <button onClick={handleSearch} className="absolute right-2 top-1/2 py-1 px-3 rounded-md transform -translate-y-1/2 bg-yellow-300 hover:bg-yellow-400">Search</button>
            </div>
          </div>

          {restaurants.map((restaurant) => (
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
