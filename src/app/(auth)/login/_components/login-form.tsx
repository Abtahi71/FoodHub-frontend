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
import { Eye, EyeOff } from "lucide-react";
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
      queryClient.invalidateQueries({ queryKey: ["user"]});
    }
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
    <div className={cn("flex flex-col gap-6")}>
      <Card className="border border-black dark:border-white">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <div className="flex justify-between mt-2">
            <Button
              onClick={() => {
                form.setFieldValue("email", "mustakimabtahi207@gmail.com");
                form.setFieldValue("password", "123456");
              }}
            >
              Demo Provider
            </Button>
            <Button
              onClick={() => {
                form.setFieldValue("email", "jake@gmail.com");
                form.setFieldValue("password", "123456");
              }}
            >
              Demo Customer
            </Button>
            <Button
              onClick={() => {
                form.setFieldValue("email", "mosh23@gmail.com");
                form.setFieldValue("password", "password");
              }}
            >
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
            className="flex flex-col gap-4"
          >
            <form.Field
              name="email"
              validators={{ onChange: loginSchema.shape.email }}
            >
              {(field) => (
                <div>
                  <Input
                    value={field.state.value}
                    type="email"
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter your email"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p style={{ color: "red" }}>
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
                <div>
                  <div className="relative w-full">
                    <Input
                      value={field.state.value}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="cursor-pointer"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p style={{ color: "red" }}>
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
            <Field>
              <Button type="submit">
                {isPending ? "Logging in..." : "Login"}
              </Button>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#">Sign up</a>
              </FieldDescription>
            </Field>
          </form>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        {serverError && (
          <p className="text-red-500 text-center font-medium bg-red-50 px-4 py-2 rounded-lg inline">
            {serverError}
          </p>
        )}
      </div>
    </div>
  );
}
