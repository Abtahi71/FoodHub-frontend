"use server"

import { cookies } from "next/headers";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

  export const reviewProvider =async (
    providerId: string,
    rating?: number,
    comment?: string
  ) => {
    const store = await cookies()
    const token = store.get("token")?.value
    try {
      console.log(
        "Submitting review for provider:",
        providerId,
        "with rating:",
        rating,
        "and comment:",
        comment
      );
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/review/provider/${providerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return { ok: false, message: data.message };
      }

      console.log(data);
      return data;
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  }
  export const getMyReviews= async (providerId: string) => {
    const store = await cookies()
    const token = store.get("token")?.value
    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/review/my_reviews/${providerId}`,
        {
          method: "GET",
          headers:{
            Authorization: token!,
          },
          cache: "no-store",
        }
      );
      if (!response.ok) {
        console.log("Failed to fetch reviews", response);
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (e: any) {
      console.error(e);
      throw new Error(e.message);
    }
  }
  export const getAllReviews= async (providerId: string) => {
    const store = await cookies()
    const token = store.get("token")?.value
    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/review/all_reviews/${providerId}`,
        {
          method: "GET",
          headers:{
            Authorization: token!,
          },
          
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (e: any) {
      console.error(e);
      throw new Error(e.message);
    }
  }

