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
  Lightbulb,
  Notebook,
  Info,
} from "lucide-react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import ThemeToggle from "./themeToggle";
import {
  getUserInfoAction,
  logoutAction,
} from "@/app/(auth)/_actions/auth.action";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const pathname = usePathname();

  const [active, setActive] = useState("");
  const [loggingout, setLoggingOut] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfoAction(),
    staleTime: 0,
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.clear();
      await logoutAction();
    } finally {
      setLoggingOut(false);
    }
  };

  // Navigation links configuration
  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/AllIdeas", label: "Ideas", icon: Lightbulb },
    { href: "/BlogPage", label: "Blog", icon: Notebook },
    { href: "/AboutUs", label: "About Us", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-xl border-b border-gray-200/80 shadow-lg shadow-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-bold group relative"
          >
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-yellow-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></span>
              <span className="relative bg-yellow-400 p-2 rounded-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-yellow-400/30 inline-block">
                🍔
              </span>
            </span>
            <span className="text-gray-900 tracking-tight">
              Food<span className="text-yellow-500 font-extrabold">Hub</span>
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex items-center gap-2">
              {/* Home Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className="relative px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-all duration-200 rounded-xl hover:bg-yellow-50/80 group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      Home
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {user && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/MyOrders"
                      className="relative px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-all duration-200 rounded-xl hover:bg-yellow-50/80 group"
                    >
                      <span className="relative z-10">Your Orders</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}

              <div className="flex items-center gap-1">
                <ThemeToggle />
              </div>

              {/* Provider/Register Link */}
              {user && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    {user.role === "PROVIDER" ? (
                      <Link
                        href={`/providerProfile/${user.id}`}
                        className="relative px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-all duration-200 rounded-xl hover:bg-yellow-50/80 group"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Store className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          Provider Profile
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></span>
                      </Link>
                    ) : user.role === "CUSTOMER" ? (
                      <Link
                        href="/provider"
                        className="relative px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-all duration-200 rounded-xl hover:bg-yellow-50/80 group"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Store className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          Register as Provider
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></span>
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
                      className="relative px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-all duration-200 rounded-xl hover:bg-yellow-50/80 group"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        Admin
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}

              {/* Cart */}
              {user && (
                <NavigationMenuItem>
                  <div className="ml-1">
                    <Cart />
                  </div>
                </NavigationMenuItem>
              )}

              {/* User Menu */}
              <NavigationMenuItem>
                {user ? (
                  <div className="flex items-center gap-3 ml-2">
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-full border border-yellow-200/50 shadow-sm hover:shadow-md transition-all duration-200 group">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-200">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 hidden lg:block group-hover:text-yellow-600 transition-colors">
                        {user.name?.split(" ")[0] || "User"}
                      </span>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      size="sm"
                      className="relative group px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 font-medium"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span className="hidden lg:inline">
                          {loggingout ? "Logging out..." : "Logout"}
                        </span>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 ml-2">
                    <Link
                      href="/login"
                      className="relative px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-all duration-200 rounded-xl hover:bg-yellow-50/80 group"
                    >
                      <span className="relative z-10">Login</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></span>
                    </Link>
                    <Link
                      href="/signup"
                      className="relative px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-105 active:scale-95 group overflow-hidden"
                    >
                      <span className="relative z-10">Sign Up</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-white/10 to-yellow-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </Link>
                  </div>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative p-3 rounded-xl hover:bg-yellow-50/80 transition-all duration-200 group"
            aria-label="Toggle menu"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></span>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200/60 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-2">
              {/* Home Link */}
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100/50 hover:text-yellow-600 rounded-xl transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="p-2 bg-yellow-50 rounded-lg group-hover:scale-110 transition-transform">
                  <Home className="h-4 w-4 text-yellow-500" />
                </span>
                <span className="font-medium">Home</span>
              </Link>

              {/* Provider/Register Link */}
              {user && (
                <>
                  {user.role === "PROVIDER" ? (
                    <Link
                      href={`/providerProfile/${user.id}`}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100/50 hover:text-yellow-600 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="p-2 bg-yellow-50 rounded-lg group-hover:scale-110 transition-transform">
                        <Store className="h-4 w-4 text-yellow-500" />
                      </span>
                      <span className="font-medium">Provider Profile</span>
                    </Link>
                  ) : user.role === "CUSTOMER" ? (
                    <Link
                      href="/provider"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100/50 hover:text-yellow-600 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="p-2 bg-yellow-50 rounded-lg group-hover:scale-110 transition-transform">
                        <Store className="h-4 w-4 text-yellow-500" />
                      </span>
                      <span className="font-medium">Register as Provider</span>
                    </Link>
                  ) : null}
                </>
              )}

              {/* Admin Link */}
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100/50 hover:text-yellow-600 rounded-xl transition-all duration-200 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="p-2 bg-yellow-50 rounded-lg group-hover:scale-110 transition-transform">
                    <Shield className="h-4 w-4 text-yellow-500" />
                  </span>
                  <span className="font-medium">Admin</span>
                </Link>
              )}

              {/* Cart for mobile */}
              {user && (
                <div className="px-4 py-2">
                  <Cart />
                </div>
              )}

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

              {/* Auth buttons for mobile */}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 rounded-xl transition-all duration-200 group font-medium"
                >
                  <span className="p-2 bg-red-50 rounded-lg group-hover:scale-110 transition-transform">
                    <LogOut className="h-4 w-4 text-red-500" />
                  </span>
                  Logout ({user.name?.split(" ")[0]})
                </button>
              ) : (
                <div className="flex flex-col gap-3 px-4 pt-2">
                  <Link
                    href="/login"
                    className="px-5 py-3 text-center text-gray-700 hover:text-yellow-600 transition-all duration-200 rounded-xl hover:bg-yellow-50/80 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-3 text-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50"
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
