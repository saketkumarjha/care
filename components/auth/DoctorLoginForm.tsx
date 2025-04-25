"use client";
import React, { useState } from "react";
import { Heart, Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorLoginSchema } from "../../lib/validation/DoctorLoginSchema";
import { loginDoctor } from "@/lib/api/doctor";
// CHANGE: Import the hook instead of the default export
import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { DoctorLoginInput } from "../../lib/validation/DoctorLoginSchema";

function DoctorLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  // CHANGE: Uncomment this line to use the context
  const { login } = useDoctorAuth(); // Use our context

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorLoginInput>({
    resolver: zodResolver(doctorLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: DoctorLoginInput) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);

      console.log("Doctor login attempt with:", {
        email: data.email,
      });

      // Call the login API
      const loginResponse = await loginDoctor({
        email: data.email,
        password: data.password,
        rememberMe: false,
      });

      // Log the full response for debugging
      console.log("Raw login response:", loginResponse);

      if (!loginResponse.success) {
        console.error("Login failed:", loginResponse.message);
        throw new Error(loginResponse.message);
      }

      // Log the response data
      console.log("Login response data:", loginResponse.data);

      // Store the doctor data in context
      if (loginResponse.data) {
        console.log("i entered in context:");
        // Add this code after successful login
        console.log("All cookies:", document.cookie);
        login(loginResponse.data);

        // router.push("/doctor");
        console.log("Doctor data stored in context:", loginResponse.data);
      }

      // Redirect to doctor dashboard
      //   router.push("/doctor/dashboard");
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
            <span className="font-bold text-xl">MediCare Doctor Portal</span>
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
              <h1 className="text-white text-xl font-bold">Doctor Sign In</h1>
              <p className="text-green-100 text-sm">
                Access your doctor portal
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
                      placeholder="doctor@example.com"
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
                  href={"/register/doctor"}
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

export default DoctorLoginPage;
