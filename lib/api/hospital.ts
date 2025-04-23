import axios from "axios";

// Define the facility interface
interface Facility {
  name: string;
  description: string;
  cost: number;
  isAvailable: boolean;
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
  doctorUnderHospitalID: string[];
  adminsInTheHospital: string[];
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
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  hospitalId?: string; // Added hospitalId property
  error?: unknown;
  data?: Record<string, unknown> | null;
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
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/hospital/signup`,
      hospitalData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Hospital registered successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios errors
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
export const loginHospital = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    // Create FormData for the request
    const formData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    const response = await axios.post(
      `${API_BASE_URL}/api/v1/hospital/login`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Add debug log to see actual response structure
    console.log('API Raw Response:', response);

    // Extract the relevant data - adjust based on actual API response structure
    return {
      success: true,
      message: "Login successful",
      token: response.data.token, // Make sure this matches the actual response structure
      hospitalId: response.data.hospitalId, // Make sure this matches the actual response structure
      data: response.data,
    };
  } catch (error) {
    console.error('Login API error:', error);
    
    if (axios.isAxiosError(error)) {
      // Handle Axios errors with more detailed logging
      console.error('Axios error response:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
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
