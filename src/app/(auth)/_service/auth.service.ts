"use server";

import { axiosClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/cookie";
import { loginSchema, signupSchema } from "@/lib/schemas/auth.schema";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { deleteCookie, getCookie, setCookie } from "@/lib/cookieUtils";
import { defaultRoutes, isValidRoute } from "@/lib/authUtils";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const login = async (payload: any, redirectPath?: string) => {
  try {
    const parsedPayload = loginSchema.safeParse(payload);
    if (!parsedPayload.success) {
      const firstError =
        parsedPayload.error.issues[0].message || "Invalid Input";
      return {
        success: false,
        message: firstError,
      };
    }
    console.log("BASE URL IN LOGIN:", BASE_URL);
    const result = await axiosClient.httpPost(
      "/auth/login",
      parsedPayload.data
    );

    const { userData, accessToken, refreshToken } = result.data;

    // console.log('THIS IS THE RESULT',result)

    // console.log('USER DATA',userData)

    const { id, role, name, email, emailVerified } = userData;

    console.log("THIS IS THE USER DATA", userData);

    console.log("THIS IS THE ROLE IN LOGIN", role);
    
    console.log("Setting access token");
    await setTokenInCookies(accessToken, "accessToken");

    console.log("Setting refresh token");
    await setTokenInCookies(refreshToken, "refreshToken");
    await setCookie("role", role, 60 * 60 * 24);

    const targetPath =
      redirectPath && isValidRoute(redirectPath, role)
        ? redirectPath
        : defaultRoutes(role);

    //redirect(targetPath || '/')
    return {
      success: true,
      redirectTo: targetPath || "/",
    };
  } catch (err: any) {
    console.log(err);
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof err.digest === "string" &&
      err.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    return {
      success: false,
      message:
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Login failed",
      debugBaseUrl: BASE_URL, // temporary
      debugErrorCode: err?.code, // temporary
      debugErrorMessage: err?.message, // temporary
    };
  }
};

export const signup = async (payload: any, redirectPath?: string) => {
  try {
    const parsedPayload = signupSchema.safeParse(payload);
    if (!parsedPayload.success) {
      const firstError =
        parsedPayload.error.issues[0].message || "Invalid Input";
      return {
        success: false,
        message: firstError,
      };
    }
    const result = await axiosClient.httpPost(
      "/auth/register",
      parsedPayload.data
    );
    redirect(redirectPath || "/login");
  } catch (err: any) {
    console.log(err);
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof err.digest === "string" &&
      err.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    console.log("This is the error", err);
    throw new Error(
      err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong"
    );
  }
};

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken) return null;

    console.log("THIS IS THE BASE URL", BASE_URL);

    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    });


    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }

    const { data } = await res.json();

   // console.log("USER DATA FROM THE BACKEND", data);

    return data;
  } catch (err) {
    console.log(err);
  }
}

export const logout = async (redirectPath?: string) => {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");

    redirect(redirectPath || "/login");
  } catch (err: any) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof err.digest === "string" &&
      err.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    return { success: false, message: "Logout failed" };
  }
};

export async function getNewTokens(refreshToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Contet-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    if (!res.ok) return false;

    const { data } = await res.json();
    await setTokenInCookies(data.accessToken, "accessToken");
    await setTokenInCookies(data.refreshToken, "refreshToken");
    return true;
  } catch (err) {
    return false;
  }
}
