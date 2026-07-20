"use server";
import { axiosClient } from "@/lib/axios/httpClient";
import { catchAsyncFrontend } from "@/lib/catchAsync";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

  export const getCategories = catchAsyncFrontend(async()=> {
      const response = await axiosClient.httpGet(`/categories`)
      return response
  })

  export const getCategoryProviders = catchAsyncFrontend(async(name: string) =>{ 
      const response = await axiosClient.httpGet(
        `/categories/providers/${name}`);
      return response
  })

  export const getCategoryMeals = catchAsyncFrontend(async(providerId: string,category?: string)=> {
   
    console.log("CATEGORY ROUTE IS GOING TO BE HIT")
      const response = await axiosClient.httpGet(
        `/categories/providers/${providerId}/meals`,{params:{
          category: category || undefined
        }})
        console.log("THIS IS THE RESPONSE FROM THE GET CATEGORY MEALS ",response)
      return response
        
  })

  export const getMeals=catchAsyncFrontend(async (params: {
    search?: string;
    category?: string;
    ratings?: string;
    isAvailable?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }) => {
    
    const res = await axiosClient.httpGet(`/meal`, {
       params:{
        search: params.search || undefined,
        category: params.category || undefined,
        ratings: params.ratings || undefined,
        isAvailable: params.isAvailable || undefined,
        sortBy: params.sortBy || undefined,  
        sortOrder: params.sortOrder || undefined,
        page: params.page || undefined,
        limit: params.limit || undefined
       }
    });
    return res;
  })

