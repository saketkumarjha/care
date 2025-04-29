import axios from "axios";

// Define the facility interface
interface Facility {
  name: string;
  description: string;
  cost: number;
  isAvailable: boolean;
}

// Define the doctor interface
interface Doctor {
  doctorId: string;
  whenJoined: string;
  whenLeft: string | null;
  isJoined: boolean;
}

// Define the admin interface
interface Admin {
  adminId: string;
  name: string;
  role: string;
  permissions: string;
  generatedId: string;
  generatedPassword: string;
  isAdmin: boolean;
}

// Define the hospital data interface
interface HospitalData {
  name: string;
  username: string;
  password: string;
  hospitalAddress: {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
  };
  contactNumberOfHospital: string;
  emailOfHospital: string;
  licenseNumberOfHospital: string;
  hospitalImages: string[];
  facilitiesInHospital: Facility[];
  isActive: boolean;
  ratingOfHospital: number;
  doctorUnderHospitalID: Doctor[];
  adminsInTheHospital: Admin[];
}

// Define the response interface
interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown> | null;
  error?: unknown;
}

// Define the login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean; // Optional field for "Remember Me" functionality
}

export interface LoginResponse extends ApiResponse {
  data?: any;
}
// API base URL - should be moved to an environment variable in production
const API_BASE_URL =
  "https://caresetubackend-g5eacseahxevh5bp.centralindia-01.azurewebsites.net";

/**
 * Register a new hospital
 * @param hospitalData - The hospital registration data
 * @returns Promise with the API response
 */
export const registerHospital = async (
  hospitalData: HospitalData
): Promise<ApiResponse> => {
  try {
    console.log("Sending registration data:", JSON.stringify(hospitalData));

    const response = await axios.post(
      `${API_BASE_URL}/api/v1/hospital/signup`,
      hospitalData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Registration response:", response);

    return {
      success: true,
      message: "Hospital registered successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Registration error full details:", error);

    if (axios.isAxiosError(error)) {
      // Log the complete error response for debugging
      console.error("API error response:", error.response?.data);
      console.error("API error status:", error.response?.status);

      return {
        success: false,
        message: error.response?.data?.message || "Failed to register hospital",
        error: error.response?.data || error.message,
      };
    }

    // Handle other errors
    return {
      success: false,
      message: "An unexpected error occurred",
      error: String(error),
    };
  }
};

/**
 * Update an existing hospital
 * @param hospitalId - The ID of the hospital to update
 * @param hospitalData - The updated hospital data
 * @param token - Authentication token
 * @returns Promise with the API response
 */
export const updateHospital = async (
  hospitalId: string,
  hospitalData: Partial<HospitalData>,
  token: string
): Promise<ApiResponse> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/hospitals/${hospitalId}`,
      hospitalData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: "Hospital updated successfully",
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update hospital",
        error: error.response?.data || error.message,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
      error: String(error),
    };
  }
};

/**
 * Login a hospital user
 * @param credentials - The login credentials (email and password)
 * @returns Promise with the API response
 */
// Update your login function to store the token properly
export const loginHospital = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    // Create URLSearchParams for the request
    const params = new URLSearchParams();
    params.append("email", credentials.email);
    params.append("password", credentials.password);

    const response = await axios.post(
      `${API_BASE_URL}/api/v1/hospital/login`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      }
    );

    // Store token for later use
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
    }

    // Also store username if available
    if (response.data.data && response.data.data.username) {
      localStorage.setItem("hospitalUsername", response.data.data.username);
    }

    return {
      success: true,
      message: response.data.message || "Login successful",
      data: response.data.data || {},
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to login hospital",
        error: error.response?.data || error.message,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
      error: String(error),
    };
  }
};

export const logoutHospital = async (
  hospitalUsername: string
): Promise<ApiResponse> => {
  console.log("Logging out hospital...");
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/hospital/logout/${hospitalUsername}`,
      {}, // Empty object as request body
      {
        headers: {},
        withCredentials: true, // This ensures cookies are sent
      }
    );
    return {
      success: true,
      message: "Logout successful",
      data: response.data,
    };
  } catch (error) {
    console.error("Logout API error:", error);

    if (axios.isAxiosError(error)) {
      // Handle 404 if you want to maintain that fallback
      if (error.response?.status === 404) {
        console.log(
          "Logout endpoint not found - handling logout on client side only"
        );
        return {
          success: true,
          message: "Logged out on client side only",
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Failed to logout hospital",
        error: error.response?.data || error.message,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
/**
 *
 * @param hospitalId - The ID of the hospital to retrieve
 * @param token
 * @returns
 */
export const getHospitalById = async (
  hospitalId: string,
  token?: string
): Promise<ApiResponse> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/hospitals/${hospitalId}`,
      {
        headers,
      }
    );

    return {
      success: true,
      message: "Hospital retrieved successfully",
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to retrieve hospital",
        error: error.response?.data || error.message,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
      error: String(error),
    };
  }
};
