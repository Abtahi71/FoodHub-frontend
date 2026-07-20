"use client";
import { useEffect, useState } from "react";

import MealCard from "./MealCard";
import { Utensils, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryMealsAction } from "@/_actions/category.action";

export default function MealSection({
  id,
  cuisineType,
}: {
  id: string;
  cuisineType: string[];
}) {
  const [loading, setLoading] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["category-meals", selectedCuisine],
    queryFn: () => getCategoryMealsAction(id, selectedCuisine || undefined),
    //enabled: !!selectedCuisine,
  });

  const meals = data?.result || [];
  //if(isLoading)return <div>Loading...</div>

  // console.log("THIS IS THE MEALS", meals[1].meal);

  const handleClick = async (name: string, providerId: string) => {
    setSelectedCuisine(name);
  };

  console.log("THIS IS THE CUISINE TYPE", cuisineType);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-gray-900">Our Menu</h2>
        </div>
        {selectedCuisine && (
          <button
            onClick={() => {
              setSelectedCuisine("");
            }}
            className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Cuisine Tabs */}
      {cuisineType && cuisineType.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cuisineType.map((cuisine: string) => (
            <button
              key={cuisine}
              onClick={() => handleClick(cuisine, id)}
              className={`
                        px-5 py-2 rounded-full font-medium transition-all duration-200
                                ${
                                  selectedCuisine === cuisine
                                    ? "bg-yellow-400 text-gray-900 shadow-md shadow-yellow-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }
                            `}
            >
              {cuisine}
            </button>
          ))}
        </div>
      )}

      {/* Meals Grid */}
      <div className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-background rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse"
              >
                <div className="aspect-video w-full bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((item: any, index: any) => (
              <MealCard
                key={`${item.id}-${index}`}
                meal={item}
                mealId={item.id}
              />
            ))}
          </div>
        ) : selectedCuisine ? (
          <div className="text-center py-12 bg-background rounded-xl border border-gray-100">
            <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No meals found in {selectedCuisine}</p>
          </div>
        ) : (
          <div className="text-center py-12 bg-background rounded-xl border border-gray-100">
            <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Select a category to see meals</p>
          </div>
        )}
      </div>
    </div>
  );
}
