"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { loginHospital} from "@/lib/api/hospital";

// Define the shape of the hospital data
interface HospitalData {
  name: string;
  username: string;
  hospitalAddress: {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
  };
  contactNumberOfHospital: string;
  emailOfHospital: string;
  licenseNumberOfHospital: string;
  ratingOfHospital?: number;
  isActive: boolean;
  hospitalImages?: string[];
  facilitiesInHospital: Array<{
    name: string;
    description: string;
    cost: number;
    isAvailable: boolean;
  }>;
  doctorUnderHospitalID?: Array<{
    id: string;
    name: string;
    specialization: string;
    contactNumber: string;
    email: string;
  }>;
  adminsInTheHospital?: Array<{
    id: string;
    name: string;
    role: string;
    contactNumber: string;
    email: string;
  }>;
  // Add any other properties from your login response
}

// Login credentials interface
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Define the shape of our context
interface HospitalAuthContextType {
  hospitalData: HospitalData | null;
  setHospitalData: (data: HospitalData) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

// Create the context with a default value
const HospitalAuthContext = createContext<HospitalAuthContextType | undefined>(
  undefined
);

// Provider component
export function HospitalAuthProvider({ children }: { children: ReactNode }) {
  const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from localStorage on initial mount
  useEffect(() => {
    const initializeAuth = () => {
      if (typeof window !== "undefined") {
        const storedData = localStorage.getItem("hospitalData");
        const storedAuth = localStorage.getItem("isHospitalAuthenticated");

        if (storedData && storedAuth === "true") {
          setHospitalData(JSON.parse(storedData));
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Call the API to login
      const response = await loginHospital({
        ...credentials,
        rememberMe: credentials.rememberMe ?? false, // Ensure rememberMe is always a boolean
      });

      // Check if login was successful
      if (response.success && response.data) {
        // Update the state with hospital data
        setHospitalData(response.data);
        setIsAuthenticated(true);

        // Store in localStorage for persistence
        if (typeof window !== "undefined") {
          localStorage.setItem("hospitalData", JSON.stringify(response.data));
          localStorage.setItem("isHospitalAuthenticated", "true");
        }

        setIsLoading(false);
        return true;
      } else {
        console.error("Login failed:", response.message);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Call the API to logout - no need to pass token
      // const response = await logoutHospital();

      // Even if API fails, we'll clear local state
      setHospitalData(null);
      setIsAuthenticated(false);

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("hospitalData");
        localStorage.removeItem("isHospitalAuthenticated");
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Logout error:", error);

      // Still clear local state on error
      setHospitalData(null);
      setIsAuthenticated(false);

      if (typeof window !== "undefined") {
        localStorage.removeItem("hospitalData");
        localStorage.removeItem("isHospitalAuthenticated");
      }

      setIsLoading(false);
      return false;
    }
  };

  return (
    <HospitalAuthContext.Provider
      value={{
        hospitalData,
        setHospitalData,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </HospitalAuthContext.Provider>
  );
}

// Custom hook to use the context
export function useHospitalAuth() {
  const context = useContext(HospitalAuthContext);
  if (context === undefined) {
    throw new Error(
      "useHospitalAuth must be used within a HospitalAuthProvider"
    );
  }
  return context;
}
