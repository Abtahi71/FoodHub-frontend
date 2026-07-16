"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { register } from "@/services/provider.service";
import { getUser } from "@/services/auth.service";

const CUISINE_OPTIONS = [
  "pizza",
  "burger",
  "soups",
  "sandwiches",
  "appetizers",
  "desserts",
  "mexican",
  "Korean",
  "mediterranean",
  "vegetarian",
  "meatbox",
  "Desserts",
  "Beverages",
];

export default function ProviderRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [user,setUser] = useState<any>(null);

useEffect(() => {
  const getCurrentUser = async () => {
    const userData = await getUser();
    setUser(userData);
  };
  getCurrentUser();
}, []);


  const [formData, setFormData] = useState({
    restaurantName: "",
    description: "",
    isOpen: true,
    address: "",
    phone: "",
    website: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isOpen: checked }));
  };

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('This is the user',user)  

    if (!imageFile) {
      toast.error("Please upload a restaurant image");
      return;
    }

    if (selectedCuisines.length === 0) {
      toast.error("Please select at least one cuisine type");
      return;
    }

    setLoading(true);

    try {
    
      const formDataToSend = new FormData();
      formDataToSend.append("restaurantName", formData.restaurantName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("isOpen", String(formData.isOpen));
      formDataToSend.append("address", formData.address);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("cuisineType", JSON.stringify(selectedCuisines));
      formDataToSend.append("image", imageFile);

      const response = await register(formDataToSend);

      if (response.ok) {
        toast.success("Restaurant registered successfully!");
        setDisabled(true);
        router.push("/");
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      
        <div className="bg-yellow-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">
            Register Your Restaurant
          </h1>
          <p className="text-yellow-100 mt-2">
            Join FoodHub and start serving delicious meals
          </p>
        </div>

        
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
          
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Restaurant Image</Label>
            <div className="flex items-center gap-6">
              <div className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Restaurant preview"
                    fill
                    className="object-cover"
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
                  Upload a clear image of your restaurant (JPG, PNG, max 5MB)
                </p>
              </div>
            </div>
          </div>

          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-3">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Restaurant Name *</Label>
                <Input
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="e.g., Spice Garden"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell customers about your restaurant, specialties, ambiance..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, City, Area"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://your-restaurant.com"
                  type="url"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="isOpen"
                checked={formData.isOpen}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isOpen" className="font-medium">
                Restaurant is currently accepting orders
              </Label>
            </div>
          </div>

          {/* Cuisine Types */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold border-b pb-3">
                Cuisine Types *
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Select all cuisines your restaurant serves
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {CUISINE_OPTIONS.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={
                    selectedCuisines.includes(cuisine) ? "default" : "outline"
                  }
                  className={`cursor-pointer text-sm py-2 px-4 ${
                    selectedCuisines.includes(cuisine)
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "hover:border-yellow-600 hover:text-yellow-600"
                  }`}
                  onClick={() => handleCuisineToggle(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>

            {selectedCuisines.length > 0 && (
              <p className="text-sm text-gray-600">
                Selected: {selectedCuisines.join(", ")}
              </p>
            )}
          </div>

          
          <div className="pt-6 border-t">
            <Button
              type="submit"
              disabled={loading || disabled}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-6 text-lg"
            >
              {loading ? "Registering..." : "Register Restaurant"}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              By registering, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
