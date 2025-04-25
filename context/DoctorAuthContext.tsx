"use client";
import React from "react";
import { createContext, useContext, useState, ReactNode } from "react";

interface DoctorData {
  username: string;
  name: string;
  email: string;
  password: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  consultationFee: number;
  averageConsultationTime: number;
  locationsOfDoctor: Array<{
    addressline1: string;
    addressLine2: string;
    addressLine3: string;
    isPrimaryLocation: boolean;
  }>;
  timeSlots: Array<{
    dayName: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      maxPatientsInTheSlot: number;
      isActive: boolean;
      status: string;
      recurring: boolean;
      exceptions: Array<{
        expectedDateOfException: string;
        status: string;
      }>;
    }>;
  }>;
  hospitalJoined?: Array<{
    hospitalId: string;
    status: string;
    whenJoined: string;
    whenLeft: string | null;
    isJoined: boolean;
  }>;
}

// Define the shape of our context
interface DoctorAuthContextType {
  doctorData: DoctorData | null;  // Changed from hospitalData to doctorData
  setDoctorData: (data: DoctorData) => void;  // Changed from setHospitalData
  isAuthenticated: boolean;
  login: (data: DoctorData) => void;
  logout: () => void;
}

const DoctorAuthContext = createContext<DoctorAuthContextType | undefined>(
  undefined
);

function DoctorAuthProvider({ children }: { children: ReactNode }) {
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const login = (data: DoctorData) => {
    setDoctorData(data);
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("doctorData", JSON.stringify(data));
      localStorage.setItem("isAuthenticated", "true");
    }
  };
  
  const logout = () => {
    setDoctorData(null);
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("doctorData");
      localStorage.removeItem("isAuthenticated");
    }
  };
  
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("doctorData");
      const storedAuth = localStorage.getItem("isAuthenticated");
      if (storedData && storedAuth === "true") {
        setDoctorData(JSON.parse(storedData));
        setIsAuthenticated(true);
      }
    }
  }, []);
  
  return (
    <DoctorAuthContext.Provider
      value={{
        doctorData,
        setDoctorData,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </DoctorAuthContext.Provider>
  );
}

export function useDoctorAuth() {
  const context = useContext(DoctorAuthContext);
  if (context === undefined) {
    throw new Error("useDoctorAuth must be used within a DoctorAuthProvider");
  }
  return context;
}

export { DoctorAuthProvider };  // Added export for the provider
export default DoctorAuthContext;