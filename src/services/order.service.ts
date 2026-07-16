"use server";
import { cookies } from "next/headers";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

  export const AddToCart =async function (providerMealId: string, quantity: number) {
    try {
      const store = await cookies()
      const token = store.get("token")?.value
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/order/add_to_cart/${providerMealId}`,
        {
          method: "POST",
          //credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
          body: JSON.stringify({
            quantity: quantity,
          }),
        }
      );
      if (!response.ok) {
        console.log("Failed to add to cart",response);
        throw new Error("Failed to add to cart");
      }
      const data = await response.json();
      console.log(data.message);
      return data;
    } catch (e: any) {
      console.error(e);
      //throw new Error(e.message);
    }
  }

  export const GetCart =async function () {
    const store = await cookies()
    const token = store.get("token")?.value
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/order/cart`, {
        method: "GET",
        //credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      });
      // if(!response.ok){
      //     console.log('Failed to get cart')
      //     throw new Error('Failed to get cart')
      // }
      const data = await response.json();
      console.log(data.message);
      return data;
    } catch (e: any) {
      console.error(e);
      //throw new Error(e.message);
    }
  }
  export const ClearCart =async function () {
    const store = await cookies()
    const token = store.get("token")?.value
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/order/clear_cart`, {
      method: "DELETE",
     // credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },

    });
    if (!response.ok) {
      console.log("Failed to clear cart");
    }
    return response.json();
  }
  export const checkOutOrder =async function (deliveryAddress: string, contact: string) {
    const store = await cookies()
    const token = store.get("token")?.value
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/order/checkout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
      body: JSON.stringify({ deliveryAddress, contact }),
    });
    if (!response.ok) {
      console.log("Failed to checkout order");
    }
    return response.json();
  }


  export const getMyOrder = async()=>{
    const store = await cookies();
    const token = store.get("token")?.value;
    try{
      const myOrders = await fetch(`${NEXT_PUBLIC_API_URL}/order/getMyOrder`,{
        method: "GET",
        //credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      })
      const data = await myOrders.json();
      return data;
    }catch(e: any){
      console.error(e);
      //throw new Error(e.message);
    } 
  }