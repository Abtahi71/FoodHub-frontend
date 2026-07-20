// import { NextRequest, NextResponse } from "next/server";

// import { UserRole } from "@/constants/roles";
// import { getUser } from "@/app/(auth)/_service/auth.service";

// export async function proxy(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   let isAuthenticated = false;
//   let role = null;

//   const user = await getUser();

//   if (!user) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   } else {
//     isAuthenticated = true;
//     role = user.role;
//   }

//   if (!isAuthenticated) {
//     if (
//       pathname.startsWith("/admin") ||
//       pathname.startsWith("/ManageProvider") ||
//       pathname.startsWith("/checkOutOrder") ||
//       pathname.startsWith("/providerEdit") ||
//       pathname.startsWith("/providerProfile")
//     ) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   if (role === UserRole.admin) {
//     if (
//       pathname.startsWith("/ManageProvider") ||
//       pathname.startsWith("/providerEdit") ||
//       pathname.startsWith("/providerProfile")
//     ) {
//       return NextResponse.redirect(new URL("/admin", request.url));
//     }
//   }

//   if (role === UserRole.provider) {
//     if (pathname.startsWith("/admin")) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   if (role === UserRole.customer) {
//     if (pathname.startsWith("/admin")) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     if (
//       pathname.startsWith("/ManageProvider") ||
//       pathname.startsWith("/providerEdit") ||
//       pathname.startsWith("/providerProfile")
//     ) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin",
//     "/admin/:path*",

//     "/ManageProvider",
//     "/ManageProvider/:path*",

//     "/providerEdit",
//     "/providerEdit/:path*",

//     "/providerProfile",
//     "/providerProfile/:path*",
//   ],
// };

import { defaultRoutes, isValidRoute, routeOwner, UserRole } from "@/lib/authUtils";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
   console.log("MIDDLEWARE HIT:", req.nextUrl.pathname);
  const pathname = req.nextUrl.pathname;
  const accessToken = req.cookies.get("accessToken")?.value;
  const role = req.cookies.get("role")?.value;



  if (accessToken && role) {
    if (!isValidRoute(pathname, role as UserRole)) {
      return NextResponse.redirect(
        new URL(defaultRoutes(role as UserRole), req.url)
      );
    }
  }
  if (!accessToken && role !== null && role !== "COMMON") {
    const owner = routeOwner(pathname);
    if (owner !== null && owner !== "COMMON") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)",
  ],
};
