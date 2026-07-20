
"use server";
import {
  deleteMeal,
  getOrders,
  getProviderById,
  getProviderMeals,
  getProviders,
  getRestaurants,
  updateProviderMeal,
  updateOrderStatus,
  CreateMeals,
  updateProvider,
} from "./../_services/providerServices";

import { register } from "../_services/providerServices";

export const registerAction = async (providerData: FormData) => {
  const result = await register(providerData);
  return result;
};

// export const getProviderById = catchAsyncFrontend(async (id: string) => {
//   const result = await axiosClient.httpGet(`/provider/${id}`);
//   return result;
// });

// export const getProviders = catchAsyncFrontend(async () => {
//   const result = await axiosClient.httpGet(`/meal/providers`);
// });
// export const getRestaurants = catchAsyncFrontend(async (searchTerm: string) => {
//   const result = await axiosClient.httpGet(`/provider/restaurant`, {
//     params: {
//       searchTerm: searchTerm || undefined,
//     },
//   });
// });

// export const updateProvider = catchAsyncFrontend(
//   async (providerId: string, providerData: FormData) => {
//     const response = await axiosClient.httpPatch(
//       `/provider/update_provider/${providerId}`,
//       providerData
//     );
//     return response;
//   }
// );

// export const CreateMeals = catchAsyncFrontend(
//   async (mealData: FormData, id: string) => {
//     const response = await axiosClient.httpPost(
//       `/provider/meals/${id}`,
//       mealData
//     );
//     return response;
//   }
// );

// export const getProviderMeals = catchAsyncFrontend(async (id: string) => {
//   const response = await axiosClient.httpGet(`/provider/providerMeals/${id}`);
// });

// export const updateProviderMeal = catchAsyncFrontend(
//   async (mealData: FormData, mealId: string) => {
//     const response = await axiosClient.httpPatch(
//       `/provider/meals/${mealId}`,
//       mealData
//     );
//     return response;
//   }
// );

// export const deleteMeal = catchAsyncFrontend(async (mealId: string) => {
//   const response = await axiosClient.httpDelete(`/provider/meals/${mealId}`);
//   return response;
// });

// export const getOrders = catchAsyncFrontend(async (id: string) => {
//   const response = await axiosClient.httpGet(`/provider/provider_orders/${id}`);
//   return response;
// });

// export const updateOrderStatus = catchAsyncFrontend(
//   async (orderId: string, newStatus: string) => {
//     const response = await axiosClient.httpPatch(
//       `/provider/updateOrderStatus/${orderId}`,
//       newStatus
//     );
//     return response;
//   }
// );

export const getProviderByIdAction = async (id: string) => {
  const result = await getProviderById(id);
  return result;
};

export const getProvidersAction = async () => {
  const result = await getProviders();
  return result;
};

export const getRestaurantsAction = async (searchTerm: string) => {
  const result = await getRestaurants(searchTerm);
  return result;
};

export const getProviderMealsAction = async (id: string) => {
  const result = await getProviderMeals(id);
  return result;
};

export const CreateMealsAction = async (mealData: FormData, id: string) => {
  const result = await CreateMeals(mealData, id);
  return result;
}

export const updateProviderAction = async (
  providerId: string,
  providerData: FormData
) => {
  const result = await updateProvider(providerId, providerData);
  return result;
};

export const updateProviderMealAction = async (
  mealData: FormData,
  mealId: string
) => {
  const result = await updateProviderMeal(mealData, mealId);
  return result;
};

export const deleteMealAction = async (mealId: string) => {
  const result = await deleteMeal(mealId);
  return result;
};

export const getOrdersAction = async (id: string) => {
  const result = await getOrders(id);
  return result;
};

export const updateOrderStatusAction = async (
  orderId: string,
  newStatus: string
) => {
  const result = await updateOrderStatus(orderId, newStatus);
  return result;
};
