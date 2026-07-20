"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription, Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import { signupSchema } from "@/lib/schemas/auth.schema";
import { SignupFormProps } from "@/interfaces/auth.interface";
import { singupAction } from "../_actions/signup.action";


export function SignupForm({ redirectPath }: SignupFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: any) => singupAction(payload),
    
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(result.message);
          return;
        }
      } catch (error: any) {
        setServerError("Something went wrong");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
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
            {/* Name */}
            <form.Field
              name="name"
              validators={{ onChange: signupSchema.shape.name }}
            >
              {(field) => (
                <div>
                  <Input
                    value={field.state.value}
                    type="text"
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter your name"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p style={{ color: "red" }}>
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Email */}
            <form.Field
              name="email"
              validators={{ onChange: signupSchema.shape.email }}
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

            {/* Password */}
            <form.Field
              name="password"
              validators={{ onChange: signupSchema.shape.password }}
            >
              {(field) => (
                <div>
                  <div className="relative w-full">
                    <Input
                      value={field.state.value}
                      type={showPassword ? "text" : "password"}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="cursor-pointer"
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

            {/* Server error */}
            {serverError && (
              <p style={{ color: "red" }} className="text-sm text-center">
                {serverError}
              </p>
            )}

            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating account..." : "Sign Up"}
              </Button>
              <Button variant="outline" type="button">
                Sign up with Google
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <a href="/login">Login</a>
              </FieldDescription>
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
