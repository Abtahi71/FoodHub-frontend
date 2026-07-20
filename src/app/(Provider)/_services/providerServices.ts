
import { axiosClient } from "@/lib/axios/httpClient";
import { catchAsyncFrontend } from "@/lib/catchAsync";


const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const register = catchAsyncFrontend(
  async (providerData: FormData) => {
    const result = await axiosClient.httpPost(`/provider/register`, providerData);
    return result
})


export const getProviderById = catchAsyncFrontend(async (id: string) => {
  const result = await axiosClient.httpGet(`/meal/providers/${id}`);
  return result
})

export const getProviders = catchAsyncFrontend(async () => {
   const result = await axiosClient.httpGet(`/meal/providers`);
   return result
})
export const getRestaurants =catchAsyncFrontend( async (searchTerm: string) => {
  const result = await axiosClient.httpGet(`/provider/my_providers`,{
    params: {
      searchTerm:searchTerm || undefined,
    },
  });
  return result
})


export const updateProvider =catchAsyncFrontend( async (
  providerId: string,
  providerData: FormData
) => {
    const response = await axiosClient.httpPatch(`/provider/update_provider/${providerId}`, providerData)
    return response
})


export const CreateMeals =catchAsyncFrontend( async (mealData: FormData, id: string) => {
    const response = await axiosClient.httpPost(
      `/provider/meals/${id}`,mealData);
      return response
})


export const getProviderMeals = catchAsyncFrontend(async (id: string) => {
    const response = await axiosClient.httpGet(
      `/provider/providerMeals/${id}`);

      return response
})


export const updateProviderMeal = catchAsyncFrontend(async (
  mealData: FormData,
  mealId: string
) => {
    const response = await axiosClient.httpPatch(
      `/provider/meals/${mealId}`,mealData);
    return response
})


export const deleteMeal =catchAsyncFrontend( async (mealId: string) => {
    const response = await axiosClient.httpDelete(
      `/provider/meals/${mealId}`)
    return response
     
})


export const getOrders =catchAsyncFrontend(async (id: string) => {

  const response = await axiosClient.httpGet(
    `/provider/provider_orders/${id}`)
   return response
})


export const updateOrderStatus =catchAsyncFrontend(async (orderId: string, newStatus: string) => {

    const response = await axiosClient.httpPatch(
      `/provider/updateOrderStatus/${orderId}`,{newStatus})
    return response
})
