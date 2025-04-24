import axios from "axios";

// Define location interface
interface Location {
  addressline1: string;
  addressLine2: string;
  addressLine3: string;
  isPrimaryLocation: boolean;
}

// Define exception interface
interface Exception {
  expectedDateOfException: string;
  status: string;
}

// Define slot interface
interface Slot {
  startTime: string;
  endTime: string;
  maxPatientsInTheSlot: number;
  isActive: boolean;
  status: string;
  recurring: boolean;
  exceptions: Exception[];
}

// Define day slot interface
interface DaySlot {
  dayName: string;
  slots: Slot[];
}

// Define hospital joined interface
interface HospitalJoined {
  hospitalId: string;
  whenJoined: string;
  whenLeft: string | null;
  isJoined: boolean;
}

// Define the doctor data interface
export interface DoctorData {
  username: string;
  name: string;
  email: string;
  password: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  consultationFee: number;
  averageConsultationTime: number;
  locationsOfDoctor: Location[];
  timeSlots: DaySlot[];
  hospitalJoined?: HospitalJoined[];
  doctorImage?: string; // Base64 string for API submission
}

// Define the response interface
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown> | null;
  error?: unknown;
}

// Define the login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    doctorId: string;
  };
  error?: unknown;
}

// API base URL - should be moved to an environment variable in production
const API_BASE_URL =
  "https://caresetubackend-g5eacseahxevh5bp.centralindia-01.azurewebsites.net";

/**
 * Register a new doctor with improved error handling and payload formatting
 * @param doctorData - The doctor registration data
 * @returns Promise with the API response
 */
export const registerDoctor = async (
  doctorData: DoctorData
): Promise<ApiResponse> => {
  try {
    // Create a clean payload object to ensure proper field formatting
    const payload: {
      username: string;
      name: string;
      email: string;
      password: string;
      specialization: string;
      licenseNumber: string;
      yearsOfExperience: number;
      consultationFee: number;
      averageConsultationTime: number;
      locationsOfDoctor: {
        addressline1: string;
        addressLine2: string;
        addressLine3: string;
        isPrimaryLocation: boolean;
      }[];
      timeSlots: {
        dayName: string;
        slots: {
          startTime: string;
          endTime: string;
          maxPatientsInTheSlot: number;
          isActive: boolean;
          status: string;
          recurring: boolean;
          exceptions: {
            expectedDateOfException: string;
            status: string;
          }[];
        }[];
      }[];
      hospitalJoined: {
        hospitalId: string;
        whenJoined: string;
        whenLeft: string | null;
        isJoined: boolean;
      }[];
      doctorImage?: string;
    } = {
      username: doctorData.username,
      name: doctorData.name,
      email: doctorData.email,
      password: doctorData.password,
      specialization: doctorData.specialization,
      licenseNumber: doctorData.licenseNumber,
      yearsOfExperience: doctorData.yearsOfExperience,
      consultationFee: doctorData.consultationFee,
      averageConsultationTime: doctorData.averageConsultationTime,
      locationsOfDoctor: doctorData.locationsOfDoctor.map((loc) => ({
        addressline1: loc.addressline1,
        addressLine2: loc.addressLine2,
        addressLine3: loc.addressLine3,
        isPrimaryLocation: loc.isPrimaryLocation,
      })),
      timeSlots: doctorData.timeSlots.map((day) => ({
        dayName: day.dayName,
        slots: day.slots.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          maxPatientsInTheSlot: slot.maxPatientsInTheSlot,
          isActive: slot.isActive,
          status: slot.status,
          recurring: slot.recurring,
          exceptions: slot.exceptions.map((exc) => ({
            expectedDateOfException: exc.expectedDateOfException,
            status: exc.status,
          })),
        })),
      })),
      hospitalJoined: doctorData.hospitalJoined
        ? doctorData.hospitalJoined.map((hosp) => ({
            hospitalId: hosp.hospitalId,
            whenJoined: hosp.whenJoined,
            whenLeft: hosp.whenLeft,
            isJoined: hosp.isJoined,
          }))
        : [],
    };

    // Add doctorImage if it exists
    if (doctorData.doctorImage) {
      payload.doctorImage = doctorData.doctorImage;
    }

    console.log("Sending doctor registration data", JSON.stringify(payload));

    // Use 'application/json' content type specifically, and raw stringified JSON

    const response = await axios.post(
      `${API_BASE_URL}/api/v1/doctor/signup`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Registration response:", response);

    console.log("Registration response status:", response.status);

    return {
      success: true,
      message: "Doctor registered successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Registration error occurred");

    if (axios.isAxiosError(error)) {
      // Log the complete error response for debugging
      console.error("API error status:", error.response?.status);
      console.error("API error response:", error.response?.data);

      // Extract a meaningful error message
      let errorMessage = "Failed to register doctor";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          // Try to extract error from HTML response
          const match = error.response.data.match(/Error: (.*?)<br>/);
          if (match && match[1]) {
            errorMessage = match[1];
          } else {
            errorMessage = error.response.data.substring(0, 200); // Truncate long HTML
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage =
            typeof error.response.data.error === "string"
              ? error.response.data.error
              : JSON.stringify(error.response.data.error);
        }
      }

      return {
        success: false,
        message: errorMessage,
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
 * Convert File to base64 string with proper data URL format
 * @param file - The file to convert
 * @returns Promise with the base64 string
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Return the full data URL including the MIME type prefix
      const dataUrl = reader.result?.toString();
      if (dataUrl) {
        resolve(dataUrl);
      } else {
        reject(new Error("Failed to convert image to base64"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

/**
 * Login a doctor user
 * @param credentials - The login credentials (email and password)
 * @returns Promise with the API response
 */
export const loginDoctor = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    console.log(credentials);
    const stringifiedPayload = JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe,
    });
    console.log("crossed stringify");
    console.log(stringifiedPayload);
    const response = await axios({
      method: "post",
      url: `${API_BASE_URL}/api/v1/doctor/login`,
      data: stringifiedPayload,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API Raw Response:", response.data);

    return {
      success: true,
      message: response.data.message || "Login successful",
      data: response.data.data || {},
    };
  } catch (error) {
    console.error("Login API error:", error);

    if (axios.isAxiosError(error)) {
      console.error("Axios error response:", error.response?.data);

      let errorMessage = "Login failed";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          const match = error.response.data.match(/Error: (.*?)<br>/);
          if (match && match[1]) {
            errorMessage = match[1];
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      return {
        success: false,
        message: errorMessage,
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
