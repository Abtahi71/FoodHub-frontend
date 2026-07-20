"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

import { useParams, useRouter } from "next/navigation";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getProviderByIdAction,
  updateProviderAction,
} from "../../_actions/providerActions";

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

export default function ProviderEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [originalImage, setOriginalImage] = useState<string>("");

  const [formData, setFormData] = useState({
    restaurantName: "",
    description: "",
    isOpen: true,
    address: "",
    phone: "",
    website: "",
  });

  const { mutate: updateProvider, isPending } = useMutation({
    mutationFn: (payload: FormData) =>
      updateProviderAction(id as string, payload),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Provider updated successfully");
      router.push("/provider");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["providerById"],
    queryFn: () => getProviderByIdAction(id as string),
  });

  useEffect(() => {
    if (!data) return;

    setFormData({
      restaurantName: data.restaurantName || "",
      description: data.description || "",
      isOpen: data.isOpen ?? true,
      address: data.address || "",
      phone: data.phone || "",
      website: data.website || "",
    });

    setSelectedCuisines(data.cuisineType || []);
    setOriginalImage(data.image);
    setImagePreview(data.image); // Show existing image
  }, [data]);

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

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      if (formData.restaurantName) {
        formDataToSend.append("restaurantName", formData.restaurantName);
      }

      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }

      formDataToSend.append("isOpen", String(formData.isOpen));

      if (formData.address) {
        formDataToSend.append("address", formData.address);
      }

      if (formData.phone) {
        formDataToSend.append("phone", formData.phone);
      }

      if (formData.website) {
        formDataToSend.append("website", formData.website);
      }

      formDataToSend.append("cuisineType", JSON.stringify(selectedCuisines));

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      updateProvider(formDataToSend);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-background rounded-xl shadow-md overflow-hidden">
        <div className="bg-yellow-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Edit Restaurant</h1>
          <p className="text-yellow-100 mt-2">
            Update your restaurant information - {formData.restaurantName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
          {/* Restaurant Image */}
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
                    <span>No image</span>
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
                  Leave empty to keep current image. Upload new image to replace
                  (JPG, PNG, max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information - All fields optional */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-3">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="Leave empty to keep current name"
                />
                <p className="text-xs text-gray-500">Optional</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Leave empty to keep current number"
                />
                <p className="text-xs text-gray-500">Optional</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Leave empty to keep current description"
                rows={4}
              />
              <p className="text-xs text-gray-500">Optional</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Leave empty to keep current address"
                />
                <p className="text-xs text-gray-500">Optional</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://your-restaurant.com"
                  type="url"
                />
                <p className="text-xs text-gray-500">Optional</p>
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

          {/* Cuisine Types - Optional to change */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold border-b pb-3">
                Cuisine Types
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Update the cuisines your restaurant serves (optional)
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

          {/* Action Buttons */}
          <div className="pt-6 border-t space-y-4">
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-6 text-lg"
              >
                {loading ? "Updating..." : "Update Restaurant"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 py-6 text-lg"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Only fields you change will be updated
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
