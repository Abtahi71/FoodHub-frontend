
import { axiosClient } from "@/lib/axios/httpClient";
import { catchAsyncFrontend } from "@/lib/catchAsync";


const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AddToCart =catchAsyncFrontend(async function (providerMealId: string, quantity: number) {
//console.log("THE PROVIDER MEAL ID IS",providerMealId)
      const response = await axiosClient.httpPost(
        `/order/add_to_cart/${providerMealId}`,{quantity})
      return response
  })

  export const GetCart =catchAsyncFrontend(async function () {
      const response = await axiosClient.httpGet(`/order/cart`)
      return response
  })


  export const ClearCart =catchAsyncFrontend(async function () {

    const response = await axiosClient.httpDelete(`/order/clear_cart`)
    return response
  
  })


  export const checkOutOrder =catchAsyncFrontend(async function (deliveryAddress: string, contact: string) {
    const response = await axiosClient.httpPost(`/order/checkout`, {deliveryAddress, contact}) 
    return response   
  })


  export const getMyOrder =catchAsyncFrontend (async()=>{
      const myOrders = await axiosClient.httpGet(`/order/getMyOrder`)
      return myOrders
       
  })