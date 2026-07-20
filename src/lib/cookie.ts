
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";

export const setTokenInCookies = async (
  token: string,
  name: string,
  fallbackMaxAge = 60 * 60 * 24
) => {
  let maxAge;

  maxAge = tokenSecondsRemaining(token);

  await setCookie(name, token, maxAge ?? fallbackMaxAge);
};

export const tokenSecondsRemaining = (token: string) => {
  if (!token) return 0;
  const tokenPayload = jwt.decode(token) as JwtPayload;
  const { exp } = tokenPayload;
  if (!tokenPayload || !exp) return 0;
  const secondsRemaining = exp - Math.floor(Date.now() / 1000);
  return secondsRemaining > 0 ? secondsRemaining : 0;
};

export const isTokenExpiringSoon = async (
  token: string,
  maxLimit: number = 300
) => {
  const secondsRemaining = tokenSecondsRemaining(token);
  return secondsRemaining < maxLimit;
};
export const isTokenExpired = async (token: string) => {
  const secondsRemaining = tokenSecondsRemaining(token);
  return secondsRemaining == 0;
};
