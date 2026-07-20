"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2, Clock, DollarSign, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMealAction, getProviderMealsAction, updateProviderMealAction } from "@/app/(Provider)/_actions/providerActions";

const CATEGORY_OPTIONS = [
  "pizza",
  "burger",
  "soups",
  "sandwiches",
  "appetizers",
  "desserts",
  "mexican",
  "korean",
  "mediterranean",
  "vegetarian",
  "meatbox",
  "beverages",
  "seafood",
  "bbq",
  "salads",
  "breakfast",
  "lunch",
  "dinner",
];

type MealItem = {
  id: string;
  meal: {
    id: string;
    name: string;
    description: string;
    category: {
      name: string;
    };
  };
  price: number;
  isAvailable: boolean;
  image: string;
  createdAt: string;
};

export default function ProviderMeals({ id }: { id: string }) {

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Form state
  const [mealData, setMealData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  console.log('THIS IS THE ID IN PROVIDERMEALS', id);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  const {data, isLoading} = useQuery({
    queryKey: ['meals', id],
    queryFn: () => getProviderMealsAction(id),
  })


  const items = data?.data?.meals || [];

  

  
  console.log('THIS IS THE ITEMS', items);
 
  const openEditModal = (meal: MealItem) => {
    setSelectedMeal(meal);
    setMealData({
      name: meal.meal.name,
      description: meal.meal.description,
      price: meal.price.toString(),
      category: meal.meal.category.name,
    });
    setSelectedCategory(meal.meal.category.name);
    setIsAvailable(meal.isAvailable);
    setImagePreview(meal.image);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMealData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setMealData((prev) => ({ ...prev, category }));
  };

  const resetForm = () => {
    setSelectedMeal(null);
    setMealData({
      name: "",
      description: "",
      price: "",
      category: "",
    });
    setImageFile(null);
    setImagePreview("");
    setIsAvailable(true);
    setSelectedCategory("");
    setUpdatingId(null);
  };

  const { mutate:updateProviderMeal} = useMutation({
    mutationFn:({mealData, updatingId}:{mealData:FormData, updatingId:string})=>updateProviderMealAction(mealData, updatingId as string),
    onSuccess: (_, variables) => {
    queryClient.invalidateQueries({
      queryKey: ["meals",id],
    });

    if (variables.mealData.has("isAvailable")) {
      toast.success(
        `Meal is now ${
          variables.mealData.get("isAvailable") === "true"
            ? "available"
            : "unavailable"
        }`
      );
    } else {
      toast.success("Meal updated successfully!");
      setIsModalOpen(false);
      resetForm();
    }
    setUpdatingId(null);
  },
    onError:()=> {
      toast.error("Failed to update meal");
    }
 
 
  })

  const queryClient = useQueryClient()

  const {mutate:deleteTheMeal} = useMutation({
    mutationFn:(mealId:string)=>deleteMealAction(mealId),
    onSuccess:()=> {
      toast.success("Meal deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["meals", id],
      })
    },
    onError:()=> {
      toast.error("Failed to delete meal");
    }
  })

  
  const handleUpdateMeal = async (
    mealId: string,
    updates?: { isAvailable?: boolean }
  ) => {
    setUpdatingId(mealId);

    
      const formDataToSend = new FormData();

      
      if (updates?.isAvailable !== undefined) {
        formDataToSend.append("isAvailable", String(updates.isAvailable));
      } else {
       
        const originalMeal = items.find((item:any) => item.id === mealId);

        if (mealData.name && mealData.name !== originalMeal?.meal.name) {
          formDataToSend.append("name", mealData.name);
        }
        if (
          mealData.description &&
          mealData.description !== originalMeal?.meal.description
        ) {
          formDataToSend.append("description", mealData.description);
        }
        if (
          mealData.price &&
          parseFloat(mealData.price) !== originalMeal?.price
        ) {
          formDataToSend.append("price", mealData.price);
        }
        if (
          selectedCategory &&
          selectedCategory !== originalMeal?.meal.category.name
        ) {
          formDataToSend.append("category", selectedCategory);
        }
        if (isAvailable !== originalMeal?.isAvailable) {
          formDataToSend.append("isAvailable", String(isAvailable));
        }
        if (imageFile) {
          formDataToSend.append("image", imageFile);
        }
      }


      if (Array.from(formDataToSend.entries()).length === 0) {
        if (!updates) {
          toast.info("No changes detected");
          setIsModalOpen(false);
        }
        setUpdatingId(null);
        return;
      }

      updateProviderMeal(
        {mealData:formDataToSend,
        updatingId:mealId}
      );

     
  }



  
 
































  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No meals yet</h3>
        <p className="text-gray-600 mt-2">
          Add your first meal to start serving customers
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item:any) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Meal Image */}
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={item.meal.name}
                fill
                className="object-contain object-center group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Category Badge */}
              <Badge className="absolute top-3 left-3 bg-black/70 text-white hover:bg-black/80">
                {item.meal.category.name}
              </Badge>

              {/* Availability Badge */}
              <Badge
                variant={item.isAvailable ? "default" : "secondary"}
                className={`absolute top-3 right-3 ${
                  item.isAvailable
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-500 hover:bg-gray-600"
                }`}
              >
                {item.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>

            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {item.meal.name}
                </h3>
                <div className="flex items-center gap-1 text-yellow-600 font-bold">
                  <DollarSign className="w-4 h-4" />
                  <span>{item.price}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {item.meal.description}
              </p>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between mt-2 pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`availability-${item.id}`}
                    checked={item.isAvailable}
                    onCheckedChange={(checked) =>
                      handleUpdateMeal(item.id, { isAvailable: checked })
                    }
                    disabled={updatingId === item.id}
                  />
                  <label
                    htmlFor={`availability-${item.id}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    {updatingId === item.id
                      ? "Updating..."
                      : item.isAvailable
                      ? "In stock"
                      : "Out of stock"}
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => openEditModal(item)}
                    disabled={updatingId === item.id}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteTheMeal(item.id, item.meal.name)}
                    disabled={updatingId === item.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 text-xs text-gray-500">
              Added:{" "}
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Meal Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-yellow-600">
              Edit Meal
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Meal Image */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Meal Image</Label>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Meal preview"
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <span>Preview</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Leave empty to keep current image
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Meal Details
              </h3>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Meal Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={mealData.name}
                  onChange={handleChange}
                  placeholder="e.g., Margherita Pizza"
                />
                <p className="text-xs text-gray-500">
                  Leave empty to keep current name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={mealData.description}
                  onChange={handleChange}
                  placeholder="Describe your meal..."
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Leave empty to keep current description
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (৳)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={mealData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500">
                  Leave empty to keep current price
                </p>
              </div>

              {/* Availability Switch */}
              <div className="flex items-center space-x-3 pt-2">
                <Switch
                  id="edit-isAvailable"
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
                <Label htmlFor="edit-isAvailable" className="font-medium">
                  Meal is available for ordering
                </Label>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold border-b pb-2">
                  Category
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Select a category for your meal
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {CATEGORY_OPTIONS.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    className={`cursor-pointer text-sm py-2 px-4 capitalize ${
                      selectedCategory === category
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "hover:border-yellow-600 hover:text-yellow-600"
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Select a category only if you want to change it
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                type="button"
                onClick={() =>
                  selectedMeal && handleUpdateMeal(selectedMeal.id)
                }
                disabled={updatingId === selectedMeal?.id}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-6"
              >
                {updatingId === selectedMeal?.id
                  ? "Updating..."
                  : "Update Meal"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="flex-1 py-6"
                disabled={updatingId === selectedMeal?.id}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
