"use client";
import React, { useState, useRef } from "react";
import {
  Building2,
  User,
  Lock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Star,
  Plus,
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hospitalSchema } from "../../lib/validation/hospitalSchema";
import { registerHospital } from "@/lib/api/hospital";
// import {useHospitalAuth} from "@/context/HospitalAuthContext";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [facilityList, setFacilityList] = useState([
    { name: "", description: "", cost: 0, isAvailable: true },
  ]);
  const [selectedImageName, setSelectedImageName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const { registerHospital } = useHospitalAuth(); // Use our context
  const router = useRouter(); // Use Next.js router for navigation
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      hospitalAddress: {
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
      },
      contactNumberOfHospital: "",
      emailOfHospital: "",
      licenseNumberOfHospital: "",
      hospitalImages: [],
      facilitiesInHospital: [
        { name: "", description: "", cost: 0, isAvailable: true },
      ],
      isActive: true,
      ratingOfHospital: 0,
      doctorUnderHospitalID: [],
      adminsInTheHospital: [],
    },
  });

  const { append, remove } = useFieldArray({
    control,
    name: "facilitiesInHospital",
  });

  const addFacility = () => {
    setFacilityList([
      ...facilityList,
      { name: "", description: "", cost: 0, isAvailable: true },
    ]);
    append({ name: "", description: "", cost: 0, isAvailable: true });
  };

  interface Facility {
    name: string;
    description: string;
    cost: number;
    isAvailable: boolean;
  }

  const removeFacility = (index: number): void => {
    const updatedFacilities: Facility[] = [...facilityList];
    updatedFacilities.splice(index, 1);
    setFacilityList(updatedFacilities);
    remove(index);
  };

  const handleFacilityChange = (index: number, field: keyof Facility, value: string | number) => {
    const updatedFacilities = [...facilityList];

    if (field === "cost") {
      // Ensure cost is always a number
      const numValue = parseFloat(value as string) || 0;
      updatedFacilities[index] = {
        ...updatedFacilities[index],
        [field]: numValue,
      };
      setFacilityList(updatedFacilities);
      setValue(`facilitiesInHospital.${index}.${field}` as Path<FormDataType>, numValue, {
        shouldValidate: true,
      });
    } else {
      updatedFacilities[index] = {
        ...updatedFacilities[index],
        [field]: value,
      };
      setFacilityList(updatedFacilities);
      setValue(`facilitiesInHospital.${index}.${field}` as any, value, {
        shouldValidate: true,
      });
    }
  };

  interface ImageChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & {
      files: FileList | null;
    };
  }

  const handleImageChange = (e: ImageChangeEvent): void => {
    if (e.target.files && e.target.files[0]) {
      const file: File = e.target.files[0];
      setSelectedImageName(file.name);
      setValue("hospitalImages", [file], { shouldValidate: true });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  interface FormDataType {
    name: string;
    username: string;
    password: string;
    licenseNumberOfHospital: string;
    contactNumberOfHospital: string;
    emailOfHospital: string;
    hospitalAddress: {
      addressLine1: string;
      addressLine2: string;
      addressLine3: string;
    };
    facilitiesInHospital: {
      name: string;
      description: string;
      cost: number;
      isAvailable: boolean;
    }[];
    hospitalImages: File[];
  }

  // interface RegisterResponse {
  //   success: boolean;
  //   data?: any;
  //   message?: string;
  // }

  const onSubmit = async (data: FormDataType): Promise<void> => {
    setIsLoading(true);
  
    try {
      // Create the base JSON data object
      const jsonData = {
        name: data.name,
        username: data.username,
        password: data.password,
        licenseNumberOfHospital: data.licenseNumberOfHospital,
        contactNumberOfHospital: data.contactNumberOfHospital,
        emailOfHospital: data.emailOfHospital,
        hospitalAddress: {
          addressLine1: data.hospitalAddress.addressLine1,
          addressLine2: data.hospitalAddress.addressLine2,
          addressLine3: data.hospitalAddress.addressLine3,
        },
        facilitiesInHospital: data.facilitiesInHospital,
        hospitalImages: [] as string[],
        isActive: true,
        ratingOfHospital: 0,
        doctorUnderHospitalID: [],
        adminsInTheHospital: [],
      };
  
      // Handle image conversion outside the main API call flow
      if (data.hospitalImages && data.hospitalImages.length > 0) {
        try {
          // Convert file to base64 string
          const base64String = await convertFileToBase64(data.hospitalImages[0]);
          jsonData.hospitalImages = [base64String];
        } catch (imageError) {
          console.error("Error converting image:", imageError);
          // Continue with registration even if image fails
        }
      }
  
      // Now make the API call with the prepared data
      console.log("Submitting hospital data:", jsonData);
      const response = await registerHospital(jsonData);
      
      // Handle the response
      if (response.success) {
        console.log("Registration successful:", response.data);
        alert("Hospital registered successfully!"); // Replace with proper UI feedback
        // Redirect to login or dashboard
        router.push("/login/hospital"); // Adjust the path as needed
      } else {
        console.error("Registration failed:", response.message, response.error);
        alert(`Registration failed: ${response.message}`); // Replace with proper UI feedback
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to convert File to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  // Helper function to handle the response
  // const handleResponse = (response: RegisterResponse) => {
  //   if (response.success) {
  //     // Handle successful registration
  //     console.log("Registration successful:", response.data);
  //     // You can add toast notification or redirect here
  //     // For example: router.push('/login');
  //   } else {
  //     // Handle registration failure
  //     console.error("Registration failed:", response.message);
  //     // You can add error toast notification here
  //   }
  //   setIsLoading(false);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-white flex flex-col">
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href={"/"}
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to homepage
        </Link>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-green-600 px-6 py-4">
            <h1 className="text-white text-xl font-bold">
              Hospital Registration
            </h1>
            <p className="text-green-100 text-sm">
              Create your hospital account
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Hospital Name */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="name"
                    >
                      Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        {...register("name")}
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Enter hospital name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="username"
                    >
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="username"
                        {...register("username")}
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.username ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Choose a username"
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="password"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className={`w-full pl-10 pr-10 py-2 border ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Create a password"
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
                      <p className="mt-1 text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters with uppercase,
                      lowercase, number, and special character.
                    </p>
                  </div>

                  {/* License Number */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="licenseNumberOfHospital"
                    >
                      License Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="licenseNumberOfHospital"
                        {...register("licenseNumberOfHospital")}
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.licenseNumberOfHospital
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Enter license number"
                      />
                    </div>
                    {errors.licenseNumberOfHospital && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.licenseNumberOfHospital.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Address Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Address Line 1 */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="hospitalAddress.addressLine1"
                    >
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="hospitalAddress.addressLine1"
                        {...register("hospitalAddress.addressLine1")}
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.hospitalAddress?.addressLine1
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Enter address line 1"
                      />
                    </div>
                    {errors.hospitalAddress?.addressLine1 && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.hospitalAddress.addressLine1.message}
                      </p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="hospitalAddress.addressLine2"
                    >
                      Address Line 2
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="hospitalAddress.addressLine2"
                        {...register("hospitalAddress.addressLine2")}
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.hospitalAddress?.addressLine2
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Enter address line 2"
                      />
                    </div>
                    {errors.hospitalAddress?.addressLine2 && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.hospitalAddress.addressLine2.message}
                      </p>
                    )}
                  </div>

                  {/* Address Line 3 */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="hospitalAddress.addressLine3"
                    >
                      Address Line 3
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="hospitalAddress.addressLine3"
                        {...register("hospitalAddress.addressLine3")}
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.hospitalAddress?.addressLine3
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Enter address line 3"
                      />
                    </div>
                    {errors.hospitalAddress?.addressLine3 && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.hospitalAddress.addressLine3.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Email */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="emailOfHospital"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="emailOfHospital"
                        {...register("emailOfHospital")}
                        type="email"
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.emailOfHospital
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.emailOfHospital && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.emailOfHospital.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="contactNumberOfHospital"
                    >
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="contactNumberOfHospital"
                        {...register("contactNumberOfHospital")}
                        type="tel"
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.contactNumberOfHospital
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Enter phone number"
                      />
                    </div>
                    {errors.contactNumberOfHospital && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.contactNumberOfHospital.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Hospital Image - Changed to File Upload */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Hospital Image (Optional)
                </h2>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="hospitalImages"
                  >
                    Upload Hospital Image
                  </label>
                  <input
                    type="file"
                    id="hospitalImages"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="mt-1 flex items-center">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                    >
                      <Upload className="h-5 w-5 mr-2 text-gray-400" />
                      Choose File
                    </button>
                    <span className="ml-3 text-sm text-gray-500">
                      {selectedImageName
                        ? selectedImageName
                        : "No file selected"}
                    </span>
                  </div>
                  {errors.hospitalImages && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.hospitalImages.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">
                    Facilities
                  </h2>
                  <button
                    type="button"
                    onClick={addFacility}
                    className="inline-flex items-center px-3 py-1 bg-green-100 border border-transparent text-sm font-medium rounded-md text-green-700 hover:bg-green-200 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Facility
                  </button>
                </div>

                {errors.facilitiesInHospital &&
                  typeof errors.facilitiesInHospital.message === "string" && (
                    <p className="mt-1 mb-3 text-sm text-red-500">
                      {errors.facilitiesInHospital.message}
                    </p>
                  )}

                {facilityList.map((facility, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-md mb-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-md font-medium text-gray-800">
                        Facility {index + 1}
                      </h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeFacility(index)}
                          className="inline-flex items-center text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {/* Facility Name */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor={`facility-${index}-name`}
                        >
                          Facility Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`facility-${index}-name`}
                          name={`facility-${index}-name`}
                          type="text"
                          value={facility.name || ""}
                          onChange={(e) =>
                            handleFacilityChange(index, "name", e.target.value)
                          }
                          className={`w-full px-3 py-2 border ${
                            errors.facilitiesInHospital?.[index]?.name
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                          placeholder="Enter facility name"
                        />
                        {errors.facilitiesInHospital?.[index]?.name && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.facilitiesInHospital[index].name.message}
                          </p>
                        )}
                      </div>

                      {/* Facility Description */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor={`facility-${index}-description`}
                        >
                          Description <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`facility-${index}-description`}
                          name={`facility-${index}-description`}
                          type="text"
                          value={facility.description || ""}
                          onChange={(e) =>
                            handleFacilityChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border ${
                            errors.facilitiesInHospital?.[index]?.description
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                          placeholder="Enter facility description"
                        />
                        {errors.facilitiesInHospital?.[index]?.description && (
                          <p className="mt-1 text-xs text-red-500">
                            {
                              errors.facilitiesInHospital[index].description
                                .message
                            }
                          </p>
                        )}
                      </div>

                      {/* Facility Cost - Improved to ensure number input */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor={`facility-${index}-cost`}
                        >
                          Cost (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Star className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id={`facility-${index}-cost`}
                            name={`facility-${index}-cost`}
                            type="number"
                            min="0"
                            step="any"
                            value={facility.cost || 0}
                            onChange={(e) => {
                              // Only allow numeric input
                              const value = e.target.value;
                              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                handleFacilityChange(
                                  index,
                                  "cost",
                                  parseFloat(value) || 0
                                );
                              }
                            }}
                            onKeyDown={(e) => {
                              // Prevent non-numeric keys except for specific control keys
                              const allowedKeys = [
                                "Backspace",
                                "Delete",
                                "ArrowLeft",
                                "ArrowRight",
                                "Tab",
                                ".",
                                "0",
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ];
                              if (!allowedKeys.includes(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className={`w-full pl-10 pr-3 py-2 border ${
                              errors.facilitiesInHospital?.[index]?.cost
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                            placeholder="Enter cost"
                          />
                        </div>
                        {errors.facilitiesInHospital?.[index]?.cost && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.facilitiesInHospital[index].cost.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className={`w-full py-3 px-4 bg-green-600 text-white rounded-md font-medium ${
                    isLoading
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:bg-green-700"
                  } transition-colors`}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Creating Account..."
                    : "Create Hospital Account"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href={"/login/hospital"}
                  className="font-semibold text-green-600 hover:text-green-500 underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
