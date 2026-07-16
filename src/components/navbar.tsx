"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { authClient } from "@/lib/auth";
import Cart from "./Cart";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { useEffect, useState } from "react";
//import { createAuthClient } from "better-auth/react";
import {
  Menu,
  X,
  Store,
  LogOut,
  User,
  Shield,
  Home,
  ChevronDown,
} from "lucide-react";
import {
  getCookie,
  getCookies,
  setCookie,
  deleteCookie,
  hasCookie,
  useGetCookies,
  useSetCookie,
  useHasCookie,
  useDeleteCookie,
  useGetCookie,
} from "cookies-next/client";
import { getMe, getUser, UserLogOut } from "@/services/auth.service";





export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const pathname = usePathname();

  const signOut = async () => {
    setLoggingOut(true);
    await UserLogOut()
    router.refresh();
    router.push("/login");
    
  };

useEffect(()=>{
  router.refresh();
  const getCurrentUser = async()=>{
    const userData = await getUser();
   // const dummy = await getMe()
    setUser(userData)
    
    console.log('THIS IS the USer in navbar',userData)
  //  console.log("THIS IS THE DUMMY", dummy);
  }
  getCurrentUser();
},[pathname])

// useEffect(()=>{
//   const getUser = async()=>{
//     const user = await getMe()
//     setUser(user)
//     console.log('THIS IS THE USER',user)
//   }
//   getUser()
// },[pathname])






  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold group"
          >
            <span className="bg-yellow-400 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              🍔
            </span>
            <span className="text-gray-900">
              Food<span className="text-yellow-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex items-center gap-6">
              {/* Home Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors"
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {user && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/MyOrders"
                      className="flex items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      Your Orders
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}

              {/* Provider/Register Link */}
              {user && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    {user.role === "PROVIDER" ? (
                      <Link
                        href={`/providerProfile/${user.id}`}
                        className="flex items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors"
                      >
                        Provider Profile
                      </Link>
                    ) : user.role === "CUSTOMER" ? (
                      <Link
                        href="/provider"
                        className="flex items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors"
                      >
                        Register as Provider
                      </Link>
                    ) : null}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}

              {/* Admin Link */}
              {user?.role === "ADMIN" && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/admin"
                      className="flex items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      <p>Admin</p>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}

              {/* Cart */}
              {user && (
                <NavigationMenuItem>
                  <Cart />
                </NavigationMenuItem>
              )}

              {/* User Menu */}
              <NavigationMenuItem>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-full">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-gray-900" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                        {user.name?.split(" ")[0] || "User"}
                      </span>
                    </div>
                    <Button
                      onClick={signOut}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      <span className="hidden lg:inline">{loggingOut ? "Logging out..." : "Logout"}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-3">
              {/* Home Link */}
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              {/* Provider/Register Link */}
              {user && (
                <>
                  {user.role === "PROVIDER" ? (
                    <Link
                      href={`/providerProfile/${user.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Store className="h-4 w-4" />
                      Provider Profile
                    </Link>
                  ) : user.role === "CUSTOMER" ? (
                    <Link
                      href="/provider"
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Store className="h-4 w-4" />
                      Register as Provider
                    </Link>
                  ) : null}
                </>
              )}

              {/* Admin Link */}
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}

              {/* Cart for mobile */}
              {user && (
                <div className="px-4 py-2">
                  <Cart />
                </div>
              )}

              {/* Auth buttons for mobile */}
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout ({user.name?.split(" ")[0]})
                </button>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-center text-gray-600 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-center bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
