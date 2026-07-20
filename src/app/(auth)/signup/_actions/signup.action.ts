"use server";

import { signup } from "@/app/(auth)/_service/auth.service";

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
