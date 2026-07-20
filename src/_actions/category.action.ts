"use server"

import { getCategories, getCategoryMeals, getCategoryProviders, getMeals } from "@/services/category.service"


  // export const getCategories = catchAsyncFrontend(async()=> {
  //     const response = await axiosClient.httpGet(`/categories`)
  //     return response
  // })

  // export const getCategoryProviders = catchAsyncFrontend(async(name: string) =>{ 
  //     const response = await axiosClient.httpGet(
  //       `${NEXT_PUBLIC_API_URL}/categories/providers/${name}`);
  //     return response
  // })

  // export const getCategoryMeals =catchAsyncFrontend(async(category: string, providerId: string)=> {
   
  //     const response = await fetch(
  //       `${NEXT_PUBLIC_API_URL}/categories/providers/${category}/${providerId}/meals`)
  //     return response
        
  // })

  // export const getMeals=async (params: {
  //   search?: string;
  //   category?: string;
  //   ratings?: string;
  //   isAvailable?: string;
  //   sortBy?: string;
  //   sortOrder?: string;
  //   page?: string;
  //   limit?: string;
  // }) => {
    
  //   const res = await axiosClient.httpGet(`/meal`, {
  //      params:{
  //       search: params.search || undefined,
  //       category: params.category || undefined,
  //       ratings: params.ratings || undefined,
  //       isAvailable: params.isAvailable || undefined,
  //       sortBy: params.sortBy || undefined,  
  //       sortOrder: params.sortOrder || undefined,
  //       page: params.page || undefined,
  //       limit: params.limit || undefined
  //      }
  //   });
  //   return res;
  // }


export const getCategoriesAction = async() => {
    const response = await getCategories()
    return response
}

export const getCategoryProvidersAction = async(name: string) =>{ 
    const response = await getCategoryProviders(name);
    return response
}

export const getCategoryMealsAction = async( providerId: string,category?: string,)=> {
    const response = await getCategoryMeals(providerId,category);
    return response
}

export const getMealsAction=async (params: {
  search?: string;
  category?: string;
  ratings?: string;
  isAvailable?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}) => {
  
  const res = await getMeals(params);
  return res;
}

