"use server";

import { getAllReviews, getMyReviews, reviewProvider } from "@/services/reviewServices";


export const reviewProviderAction = async(
    providerId: string,
    rating?: number,    
    comment?: string
  ) => {
      const response = await reviewProvider(providerId, rating, comment);
        return response
  }

  export const getMyReviewsAction=async (providerId: string) => {
    const response = await getMyReviews(providerId);
      return response
}

export const getAllReviewsAction=async (providerId: string) => {
  const response = await getAllReviews(providerId);
    return response
}