"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { LoginFormProps } from "@/interfaces/auth.interface";
import { getUserInfoAction, loginAction } from "../../_actions/auth.action";

//import { loginAction } from "@/services/auth.services"

export function LoginForm({ redirectPath }: LoginFormProps) {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfoAction(),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: any) => loginAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;
        console.log("THIS IS THE RESULT", result.success);
        console.log("user from the login form", user);
        if (!result.success) {
          setServerError(result.message);
          console.log(serverError);
          return;
        }

        router.push(result.redirectTo || "/");
      } catch (error: any) {
        setServerError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Something went wrong"
        );
        console.log(serverError);
      }
    },
  });

  return (
    <div
      className={cn("flex flex-col gap-6 max-w-md mx-auto w-full px-4 sm:px-0")}
    >
      <Card className="border border-gray-200 sm:w-[500px] dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Enter your credentials to access your account
          </CardDescription>

          {/* Demo Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => {
                form.setFieldValue("email", "mustakimabtahi207@gmail.com");
                form.setFieldValue("password", "123456");
              }}
              variant="outline"
              className="flex-1 border-yellow-200 dark:border-yellow-500/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-colors text-sm"
              size="sm"
            >
              <User className="h-3.5 w-3.5 mr-1.5" />
              Demo Provider
            </Button>
            <Button
              onClick={() => {
                form.setFieldValue("email", "jake@gmail.com");
                form.setFieldValue("password", "123456");
              }}
              variant="outline"
              className="flex-1 border-yellow-200 dark:border-yellow-500/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-colors text-sm"
              size="sm"
            >
              <User className="h-3.5 w-3.5 mr-1.5" />
              Demo Customer
            </Button>
            <Button
              onClick={() => {
                form.setFieldValue("email", "mosh23@gmail.com");
                form.setFieldValue("password", "password");
              }}
              variant="outline"
              className="flex-1 border-yellow-200 dark:border-yellow-500/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-colors text-sm"
              size="sm"
            >
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Demo Admin
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form
            method="POST"
            action="#"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-5"
          >
            <form.Field
              name="email"
              validators={{ onChange: loginSchema.shape.email }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                    <Input
                      value={field.state.value}
                      type="email"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Enter your email"
                      className="pl-9 py-2.5 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500 dark:bg-red-400"></span>
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{ onChange: loginSchema.shape.password }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                    <Input
                      value={field.state.value}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="pl-9 pr-10 py-2.5 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500 dark:bg-red-400"></span>
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <Field className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white font-semibold py-2.5 text-base transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <FieldDescription className="text-center text-gray-600 dark:text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium hover:underline transition-colors"
                >
                  Sign up
                </a>
              </FieldDescription>
            </Field>
          </form>
        </CardContent>
      </Card>

      {/* Server Error Display */}
      {serverError && (
        <div className="flex justify-center animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-center font-medium px-5 py-3 rounded-lg inline-flex items-center gap-2 shadow-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 dark:bg-red-400"></span>
            {serverError}
          </div>
        </div>
      )}
    </div>
  );
}
