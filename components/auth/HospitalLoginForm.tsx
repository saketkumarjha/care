"use client";
import React, { useState } from "react";
import { Heart, Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validation/loginSchema";
// import { loginHospital } from "@/lib/api/hospital";
import { useHospitalAuth } from "@/context/HospitalAuthContext";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useHospitalAuth(); // Use our context

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);

      console.log("Login attempt with:", {
        email: data.email,
        rememberMe: data.rememberMe,
      });

      // Call the login function from context which will handle the API call
      const loginSuccess = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (!loginSuccess) {
        throw new Error("Failed to login. Please check your credentials.");
      }

      // Redirect to hospital dashboard
      router.push("/hospital");
    } catch (error) {
      console.error("Login submission error:", error);
      setLoginError(
        error instanceof Error
          ? error.message
          : "Failed to login. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6" />
            <span className="font-bold text-xl">MediCare Hospital</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Back button */}
          <Link
            href={"/"}
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to homepage
          </Link>

          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-green-600 px-6 py-4">
              <h1 className="text-white text-xl font-bold">Sign In</h1>
              <p className="text-green-100 text-sm">
                Access your patient portal
              </p>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label
                      className="block text-gray-700 text-sm font-medium"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full pl-10 pr-10 py-2 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      placeholder="••••••••"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember me */}
                <div className="flex items-center mb-6">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    {...register("rememberMe")}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className={`w-full py-3 px-4 bg-green-600 text-white rounded-md font-medium ${
                    isSubmitting
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:bg-green-700"
                  } transition-colors`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
                {loginError && (
                  <p className="mt-4 text-sm text-red-600">{loginError}</p>
                )}
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">
                  or
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Create account link */}
              <p className="text-center text-gray-700 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href={"/register/hospital"}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>

          {/* Privacy policy */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            By signing in, you agree to our{" "}
            <a href="#" className="text-green-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-green-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
