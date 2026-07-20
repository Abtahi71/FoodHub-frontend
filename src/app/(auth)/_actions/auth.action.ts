"use server"
import { getNewTokens, getUserInfo, login, logout, signup } from "../_service/auth.service";

export const getUserInfoAction = async () => {
  const user = await getUserInfo();
  return user;
};

export const loginAction = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const result = await login({ email, password });
  console.log("THIS IS THE RESULT FROM AUTH ACTION", result);
  return result;
};

export const singupAction = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const result = await signup({ name, email, password });
  return result;
};

export const getNewTokenAction = async (refreshToken: string) => {
  const result = await getNewTokens(refreshToken);
  return result;
};

export const logoutAction = async () => {
  const result = await logout();
  return result;
};
