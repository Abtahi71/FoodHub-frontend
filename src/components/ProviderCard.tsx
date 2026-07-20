import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store, MapPin, Clock } from "lucide-react";

export default function ProviderCard({ meal }: { meal: any }) {
  // Determine if it's a provider or meal
  const isProvider = meal.restaurantName !== undefined;
  const displayName = isProvider ? meal.restaurantName : meal.name;
  const displayImage = meal.image || "/placeholder-food.png";
  const isOpen = meal.isopen || meal.isAvailable;

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-yellow-200">
      {/* Image with overlay */}
      <div className="relative aspect-video w-full overflow-hidden">
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 to-transparent" />
        <img
          src={displayImage}
          alt={displayName}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-20">
          <Badge
            variant="secondary"
            className={`
              ${
                isOpen
                  ? "bg-yellow-400 text-gray-900 dark:text-white hover:bg-yellow-500"
                  : "bg-gray-200 text-gray-600 dark:text-white"
              }
            `}
          >
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>

      <CardHeader className="relative">
        {/* Category/Cuisine Tag */}
        {meal.category?.name && (
          <div className="absolute -top-3 left-4 z-30">
            <Badge variant="outline" className="bg-background shadow-sm">
              {meal.category.name}
            </Badge>
          </div>
        )}

        <CardAction>
          {meal.price && (
            <Badge
              variant="outline"
              className="border-yellow-200 text-yellow-700"
            >
              ৳{meal.price}
            </Badge>
          )}
        </CardAction>

        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 transition-colors">
          {displayName}
        </CardTitle>

        <CardDescription className="flex flex-col gap-2">
          {/* Address */}
          {meal.address && (
            <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-white">
              <MapPin className="h-3.5 w-3.5 text-yellow-400" />
              {meal.address}
            </span>
          )}

          {/* Cuisine Type or Description */}
          {meal.cuisineType && meal.cuisineType.length > 0 && (
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-white">
              <Store className="h-3.5 w-3.5 text-yellow-400" />
              {meal.cuisineType.join(" • ")}
            </span>
          )}

          {/* Description for meals */}
          {meal.description && (
            <p className="text-sm text-gray-600 dark:text-white line-clamp-2 mt-1">
              {meal.description}
            </p>
          )}
        </CardDescription>
      </CardHeader>

      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          className="w-full group-hover:bg-yellow-400 group-hover:text-gray-900 dark:text-white transition-colors"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
