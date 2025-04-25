"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

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

// Define the shape of our context
interface HospitalAuthContextType {
  hospitalData: HospitalData | null;
  setHospitalData: (data: HospitalData) => void;
  isAuthenticated: boolean;
  login: (data: HospitalData) => void;
  logout: () => void;
}

// Create the context with a default value
const HospitalAuthContext = createContext<HospitalAuthContextType | undefined>(undefined);

// Provider component
export function HospitalAuthProvider({ children }: { children: ReactNode }) {
  const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Login function
  const login = (data: HospitalData) => {
    setHospitalData(data);
    setIsAuthenticated(true);
    
    // Optionally store in localStorage for persistence across page refreshes
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospitalData', JSON.stringify(data));
      localStorage.setItem('isHospitalAuthenticated', 'true');
    }
  };

  // Logout function
  const logout = () => {
    setHospitalData(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hospitalData');
      localStorage.removeItem('isHospitalAuthenticated');
    }
  };

  // Initialize from localStorage on mount (client-side only)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('hospitalData');
      const storedAuth = localStorage.getItem('isHospitalAuthenticated');
      
      if (storedData && storedAuth === 'true') {
        setHospitalData(JSON.parse(storedData));
        setIsAuthenticated(true);
      }
    }
  }, []);

  return (
    <HospitalAuthContext.Provider value={{ 
      hospitalData, 
      setHospitalData, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </HospitalAuthContext.Provider>
  );
}

// Custom hook to use the context
export function useHospitalAuth() {
  const context = useContext(HospitalAuthContext);
  if (context === undefined) {
    throw new Error('useHospitalAuth must be used within a HospitalAuthProvider');
  }
  return context;
}