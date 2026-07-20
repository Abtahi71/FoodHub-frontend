"use server";

import {
  AddToCart,
  GetCart,
  getMyOrder,
  ClearCart,
  checkOutOrder,
} from "../_services/order.service";


export const AddToCartAction = async (
  providerMealId: string,
  quantity: number
) => {
  const response = await AddToCart(providerMealId, quantity);
  return response;
};
export const GetCartAction = async () => {
  const response = await GetCart();
  return response;
};

export const ClearCartAction = async () => {
  const response = await ClearCart();
  return response;
};

export const checkOutOrderAction = async (
  deliveryAddress: string,
  contact: string
) => {
  const response = await checkOutOrder(deliveryAddress, contact);
  return response;
};

export const getMyOrderAction = async () => {
  const myOrders = await getMyOrder();
  return myOrders;
};
