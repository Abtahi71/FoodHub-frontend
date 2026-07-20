"use server"

import { getAllOrders, getAllUsers,getProviderForAdmin,updateUserStatus } from "../_services/admin.service"

export const getAllUsersAction = async({
    page,
    limit,
    search,
    userRole,
    userSortBy,
    userSortOrder,
    isActive
}:{page: number,
     limit?: number,
     search?:string,
     userRole?: string,
     userSortBy?: string,
     userSortOrder?: string,
    isActive?: boolean}
    )=>{
    const result = await getAllUsers(page, limit, search,userRole, userSortBy, userSortOrder,isActive);
    return result
}

export const getAllOrdersAction = async({page, limit}:{page: number, limit?: number})=>{
  const result = await getAllOrders(page, limit);
  return result
}

export const updateUserStatusAction = async(userId: string, status: string)=>{
  const result = await updateUserStatus(userId, status);
  return result
}

export const getProviderAdminAction = async(sortBy?: string, sortOrder?: string, page?: number, limit?: number,searchTerm?:string,minRating?: number)=>{
  const result = await getProviderForAdmin(sortBy, sortOrder, page, limit,searchTerm,minRating);
  return result
}
