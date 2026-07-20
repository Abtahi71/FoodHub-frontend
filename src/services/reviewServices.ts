"use server"

import { axiosClient } from "@/lib/axios/httpClient";
import { catchAsyncFrontend } from "@/lib/catchAsync";


const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const reviewProvider =catchAsyncFrontend(async (
    providerId: string,
    rating?: number,
    comment?: string
  ) => {
      const response = await axiosClient.httpPost(
        `/review/provider/${providerId}`,{ rating, comment })
        return response
  })


  export const getMyReviews=catchAsyncFrontend(async (providerId: string) => {

      const response = await axiosClient.httpGet(
        `/review/my_reviews/${providerId}`)
        return response
  })


  export const getAllReviews=catchAsyncFrontend (async (providerId: string) => {
      const response = await axiosClient.httpGet(
        `/review/all_reviews/${providerId}`)
        return response
       
  })

