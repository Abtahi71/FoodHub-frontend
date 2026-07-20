"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProviderMeals from "@/app/(Provider)/_components/ProviderMeals";
import ProviderOrders from "@/app/(Provider)/_components/ProviderOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateMealsAction } from "../../_actions/providerActions";

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

export default function ManageProvider() {
  const { id } = useParams(); // This is the providerId (user ID)
  const providerId = id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient()

  // Form state
  const [mealData, setMealData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const {mutate: createMeal,isPending} = useMutation({
    mutationFn:(payload:FormData)=>CreateMealsAction(payload, providerId),
    onSuccess:(data)=>{
      console.log(data);
      toast.success("Meal created successfully");
      queryClient.invalidateQueries({queryKey: ["meals", id]})
      setIsModalOpen(false);
      resetForm();
      setLoading(false);
    },
    onError:(error)=>{
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  })

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

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
  };

  const handleCreateMeal = async () => {
   
    if (!mealData.name) {
      toast.error("Please enter meal name");
      return;
    }
    if (!mealData.description) {
      toast.error("Please enter meal description");
      return;
    }
    if (!mealData.price) {
      toast.error("Please enter meal price");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!imageFile) {
      toast.error("Please upload a meal image");
      return;
    }
    if (!id) {
      toast.error("Provider ID not found");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", mealData.name);
      formDataToSend.append("description", mealData.description);
      formDataToSend.append("price", mealData.price);
      formDataToSend.append("category", selectedCategory);
      formDataToSend.append("isAvailable", String(isAvailable));
      formDataToSend.append("image", imageFile);
      formDataToSend.append("providerId", id as string);

      createMeal(formDataToSend);
    } catch (error) {
      console.error("Failed to create meal:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Create Meal Button */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              + Add New Meal
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-yellow-600">
                Create New Meal
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Meal Image Upload */}
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
                      Upload meal image (JPG, PNG, max 5MB)
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
                  <Label htmlFor="name">Meal Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={mealData.name}
                    onChange={handleChange}
                    placeholder="e.g., Margherita Pizza"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={mealData.description}
                    onChange={handleChange}
                    placeholder="Describe your meal..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (৳) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={mealData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Availability Switch */}
                <div className="flex items-center space-x-3 pt-2">
                  <Switch
                    id="isAvailable"
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                  />
                  <Label htmlFor="isAvailable" className="font-medium">
                    Meal is available for ordering
                  </Label>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Category *
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
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <Button
                  type="button"
                  onClick={handleCreateMeal}
                  disabled={loading}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-6"
                >
                  {loading ? "Creating..." : "Create Meal"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                  className="flex-1 py-6"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* You can add a list of existing meals here */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Meals</h2>
          <ProviderMeals id={providerId} />
          {/* Add your meals list component here */}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 mt-10">Your Orders</h2>
          <ProviderOrders id={providerId} />
        </div>
      </div>
    </div>
  );
}
