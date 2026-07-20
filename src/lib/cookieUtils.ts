import { cookies } from "next/headers";

export const setCookie = async (
  name: string,
  value: string,
  maxAge: number
) => {
  const cookieStore = await cookies();

  cookieStore.set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
};

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};
export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.delete(name);
};
