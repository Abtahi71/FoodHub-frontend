import axios from "axios";
import { cookies, headers } from "next/headers";

import { APIRequestOptions } from "@/interfaces/auth.interface";
import { isTokenExpiringSoon } from "../cookie";
import { getNewTokens } from "@/app/(auth)/_service/auth.service";

const tryRefreshToken = async (accessToken: string, refreshToken: string) => {
  if (!isTokenExpiringSoon(accessToken)) return;
  const requestHeaders = await headers();

  //if(requestHeaders.get('x-token-refreshed')==="1")return
  try {
    await getNewTokens(refreshToken);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const axiosInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) {
    return axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
      timeout: 30000,
    });
  }

  await tryRefreshToken(accessToken, refreshToken);

  const cookieHeaders = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Cookie: cookieHeaders,
    },
  });
  return instance;
};

const httpGet = async (endPoint: string, options?: APIRequestOptions) => {
  try {
    const instance = await axiosInstance();
    const response = await instance.get(endPoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const httpPost = async (
  endPoint: string,
  data: unknown,
  options?: APIRequestOptions
) => {
  try {
    const instance = await axiosInstance();
    const isFormData = data instanceof FormData;
    const response = await instance.post(endPoint, data, {
      params: options?.params,
      headers: {
        ...(isFormData && { "Content-type": "multipart/form-data" }),
        ...options?.headers,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
const httpPatch = async (
  endPoint: string,
  data: unknown,
  options?: APIRequestOptions
) => {
  try {
    const instance = await axiosInstance();
    const isFormData = data instanceof FormData;
    const response = await instance.patch(endPoint, data, {
      params: options?.params,
      headers: {
        ...(isFormData && { "Content-type": "multipart/form-data" }),
        ...options?.headers,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
const httpDelete = async (endPoint: string, options?: APIRequestOptions) => {
  try {
    const instance = await axiosInstance();
    const response = await instance.delete(endPoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const axiosClient = {
  httpGet,
  httpPost,
  httpPatch,
  httpDelete,
};
