"use server";
import { axiosClient } from "@/lib/axios/httpClient";
import { catchAsyncFrontend } from "@/lib/catchAsync";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllUsers = catchAsyncFrontend(
  async (
    page: number,
    limit?: number,
    search?: string,
    userRole?: string,
    userSortBy?: string,
    userSortOrder?: string,
    isActive?: boolean

  ) => {
    const result = await axiosClient.httpGet(`/admin/users`, {
      params: {
        page,
        limit,
        search,
        userRole,
        sortBy: userSortBy,
        sortOrder: userSortOrder,
        isActive
      },
    });
    return result;
  }
);

// export const getAllOrders=async (params: { page: number; limit: number }) => {
//   const store = await cookies();
//   const token = store.get("token")?.value;
//   try {
//     const query = new URLSearchParams();

//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         query.append(key, String(value));
//       }
//     });

//     console.log("Query parameters for orders:", query.toString());
//     const res = await fetch(
//       `${NEXT_PUBLIC_API_URL}/admin/orders?${query.toString()}`,
//       {
//         method: "GET",
//         //credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token!,
//         },
//       }
//     );
//     if (res.ok) {
//       const data = await res.json();
//       return data;
//     } else {
//       console.log("Failed to fetch orders", res.statusText);
//       //  throw new Error("Failed to fetch orders");
//     }
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

export const getAllOrders = catchAsyncFrontend(
  async (page: number, limit?: number) => {
    const result = await axiosClient.httpGet(`/admin/orders`, {
      params: {
        page,
        limit,
      },
    });

    return result;
  }
);
export const updateUserStatus = catchAsyncFrontend(
  async (userId: string, status: string) => {
    const result = await axiosClient.httpPatch(
      `/admin/update-status/${userId}`,
      { status }
    );
    return result;
  }
);

export const getProviderForAdmin = catchAsyncFrontend(
  async (sortBy?: string, sortOrder?: string, page?: number, limit?: number,searchTerm?:string,minRating?: number) => {
    const result = await axiosClient.httpGet(`/admin/providers`, {
      params: {
        sortBy,
        sortOrder,
        page,
        limit,
        searchTerm,
        minRating
      },
    });
    return result;
  }
);
