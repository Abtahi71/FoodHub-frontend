"use server";
import { cookies } from "next/headers";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

  export const getCategories = async()=> {
    const store = await cookies();
    const token = store.get("token")?.value;
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      // console.log("THIS IS THE CATEGORY RESPONSE", response);
      const data = await response.json();
      return data.categories;
    } catch (e: any) {
      console.error(e);
      // throw new Error(e.message);
    }
  }

  export const getCategoryProviders = async(name: string) =>{
     const store = await cookies();
     const token = store.get("token")?.value;
    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/categories/providers/${name}`,{
          
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category Providers");
      }
      const data = await response.json();
      return data;
    } catch (e: any) {
      console.error(e);
      // throw new Error(e.message);
    }
  }

  export const getCategoryMeals = async(category: string, providerId: string)=> {
     const store = await cookies();
     const token = store.get("token")?.value;
    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/categories/providers/${category}/${providerId}/meals`,
        {
          
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category meals");
      }
      const data = await response.json();
      return data;
    } catch (e: any) {
      console.error(e);
      //throw new Error(e.message);
    }
  }

  export const getMeals=async (params: {
    search?: string;
    category?: string;
    ratings?: string;
    isAvailable?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }) => {
     const store = await cookies();
     const token = store.get("token")?.value;
    const query = new URLSearchParams();

    //console.log("Params in getMeals:", params.search);

    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });

    const res = await fetch(`${NEXT_PUBLIC_API_URL}/meal?${query.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(text);
      throw new Error(`Request failed with status ${res.status}`);
    }

    // if (!res.ok) {
    //   console.log(res.json())
    //   throw new Error("Failed to fetch meals");
    // }
    const data = await res.json();
    //console.log("data from category service", data);
    return data;
  }

