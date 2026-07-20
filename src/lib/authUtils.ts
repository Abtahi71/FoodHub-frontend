export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN" | "COMMON";
export type RouteOwner = "CUSTOMER" | "PROVIDER" |"ADMIN" | "COMMON" | null;

const authRoutes = ["/login", "/signup"];

export const isAuthRoute = (pathname: string) => authRoutes.includes(pathname);

const userRoutes: RouteConfig = {
  exact: [
    "/checkOut",
    "/MyOrders"
  ],
  regExp: [/^\/users\/[^/]+$/],
};
const providerRoutes: RouteConfig = {
  exact: ["/ManageProvider", "/providerEdit", "/providerProfile"],
  regExp: [
    /^\/providerProfile\/[^/]+$/,
    /^\/providerEdit\/[^/]+$/,
    /^\/ManageProvider\/[^/]+$/,
  ],
};
const adminRoutes: RouteConfig = {
  exact: [],
  regExp: [/^\/admin/],
};
const commonRoutes: RouteConfig = {
  exact: ["/profile"],
  regExp: [],
};

export type RouteConfig = {
  exact: string[];
  regExp: RegExp[];
};

const isRouteMatches = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) return true;

  return routes.regExp.some((pattern: RegExp) => pattern.test(pathname));
};

export const routeOwner = (route: string): RouteOwner => {
  if (isRouteMatches(route, userRoutes)) return "CUSTOMER";
  if (isRouteMatches(route, providerRoutes)) return "PROVIDER";
  if (isRouteMatches(route, adminRoutes)) return "ADMIN";
  if (isRouteMatches(route, commonRoutes)) return "COMMON";
  return null;
};

export const isValidRoute = (route: string, role: UserRole) => {
  const cleanedRoute = route.split("?")[0];
  const owner = routeOwner(cleanedRoute);

  if (owner === role || owner === null || owner === "COMMON") return true;
  return false;
};

export const defaultRoutes = (role: UserRole) => {
  if (role === "ADMIN") return "/admin";
  else if (role === "CUSTOMER") return "/";
  else if (role === "PROVIDER") return "/";
  else return "/";
};
