"use client";
import React, { useState, useRef } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import Link from "next/link";
import { useForm, useFieldArray, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hospitalSchema } from "../../lib/validation/hospitalSchema";
import { registerHospital } from "@/lib/api/hospital";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [facilityList, setFacilityList] = useState([
    { name: "", description: "", cost: 0, isAvailable: true },
  ]);
  const [selectedImageName, setSelectedImageName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

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

  // Custom notification function
  const showNotificationMessage = (message: string, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

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
    if (facilityList.length > 1) {
      const updatedFacilities: Facility[] = [...facilityList];
      updatedFacilities.splice(index, 1);
      setFacilityList(updatedFacilities);
      remove(index);
    } else {
      showNotificationMessage("You must have at least one facility");
    }
  };

  const handleFacilityChange = (
    index: number,
    field: keyof Facility,
    value: string | number | boolean
  ) => {
    const updatedFacilities = [...facilityList];

    if (field === "cost") {
      // Ensure cost is always a number
      const numValue = parseFloat(value as string) || 0;
      updatedFacilities[index] = {
        ...updatedFacilities[index],
        [field]: numValue,
      };
      setFacilityList(updatedFacilities);
      setValue(`facilitiesInHospital.${index}.${field}` as `facilitiesInHospital.${number}.${keyof Facility}`, numValue, {
        shouldValidate: true,
      });
    } else {
      updatedFacilities[index] = {
        ...updatedFacilities[index],
        [field]: value,
      };
      setFacilityList(updatedFacilities);
      setValue(`facilitiesInHospital.${index}.${field}` as `facilitiesInHospital.${number}.${keyof Facility}`, value, {
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

  const handleNextStep = () => {
    // Validate current step before proceeding
    let valid = true;

    if (currentStep === 1) {
      // Basic info validation would happen via React Hook Form
      if (
        errors.name ||
        errors.username ||
        errors.password ||
        errors.hospitalAddress?.addressLine1 ||
        errors.hospitalAddress?.addressLine2 ||
        errors.hospitalAddress?.addressLine3
      ) {
        showNotificationMessage("Please fill all required fields correctly");
        valid = false;
      }
    }

    if (currentStep === 2) {
      // Contact info validation
      if (
        errors.contactNumberOfHospital ||
        errors.emailOfHospital ||
        errors.licenseNumberOfHospital
      ) {
        showNotificationMessage("Please fill all required fields correctly");
        valid = false;
      }
    }

    if (valid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
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
          const base64String = await convertFileToBase64(
            data.hospitalImages[0]
          );
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
        showNotificationMessage("Hospital registered successfully!", "success");
        // Redirect to login or dashboard
        setTimeout(() => {
          router.push("/login/hospital"); // Adjust the path as needed
        }, 2000);
      } else {
        console.error("Registration failed:", response.message, response.error);
        showNotificationMessage(`Registration failed: ${response.message}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showNotificationMessage(
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert File to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString().split(",")[1];
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center py-8 px-4">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Hospital Registration
            </h2>
            <p className="text-gray-600 mt-1">
              Join Care Setu&apos;s healthcare network
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-xs mt-1">
                    {step === 1
                      ? "Basic Info"
                      : step === 2
                      ? "Contact Details"
                      : "Facilities"}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
              <div
                className="absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hospital Name *
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Care Setu Hospital"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username *
                  </label>
                  <input
                    id="username"
                    {...register("username")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="caresetu_hospital"
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.username.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password.message as string}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters with uppercase,
                    lowercase, numbers, and special characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="addressLine1"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address Line 1 *
                    </label>
                    <input
                      id="addressLine1"
                      {...register("hospitalAddress.addressLine1")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Street Address"
                    />
                    {errors.hospitalAddress?.addressLine1 && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.hospitalAddress.addressLine1.message as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="addressLine2"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address Line 2 *
                    </label>
                    <input
                      id="addressLine2"
                      {...register("hospitalAddress.addressLine2")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Area, Locality"
                    />
                    {errors.hospitalAddress?.addressLine2 && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.hospitalAddress.addressLine2.message as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="addressLine3"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address Line 3 *
                    </label>
                    <input
                      id="addressLine3"
                      {...register("hospitalAddress.addressLine3")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="City, State, Zip"
                    />
                    {errors.hospitalAddress?.addressLine3 && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.hospitalAddress.addressLine3.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="contactNumberOfHospital"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Number *
                  </label>
                  <input
                    id="contactNumberOfHospital"
                    {...register("contactNumberOfHospital")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="10-digit phone number"
                  />
                  {errors.contactNumberOfHospital && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.contactNumberOfHospital.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="emailOfHospital"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    id="emailOfHospital"
                    {...register("emailOfHospital")}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="hospital@example.com"
                  />
                  {errors.emailOfHospital && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.emailOfHospital.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="licenseNumberOfHospital"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    License Number *
                  </label>
                  <input
                    id="licenseNumberOfHospital"
                    {...register("licenseNumberOfHospital")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Hospital License Number"
                  />
                  {errors.licenseNumberOfHospital && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.licenseNumberOfHospital.message as string}
                    </p>
                  )}
                </div>

                {/* Hospital Image Upload */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="hospitalImages"
                  >
                    Hospital Image (Optional)
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
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center"
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
                      {errors.hospitalImages.message as string}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Facilities */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Hospital Facilities
                  </h3>
                  <button
                    type="button"
                    onClick={addFacility}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Add Facility
                  </button>
                </div>

                {errors.facilitiesInHospital && (
                  <p className="mt-1 text-xs text-red-500">
                    {(errors.facilitiesInHospital as { message?: string })?.message || ""}
                  </p>
                )}

                {facilityList.map((facility, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">
                        Facility #{index + 1}
                      </h4>
                      {facilityList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFacility(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facility Name *
                        </label>
                        <input
                          type="text"
                          value={facility.name}
                          onChange={(e) =>
                            handleFacilityChange(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="e.g., X-Ray, MRI, ICU"
                        />
                        {errors.facilitiesInHospital?.[index]?.name && (
                          <p className="mt-1 text-xs text-red-500">
                            {
                              (errors.facilitiesInHospital?.[index]?.name?.message as string)
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cost (INR) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={facility.cost}
                          onChange={(e) =>
                            handleFacilityChange(index, "cost", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter cost in INR"
                        />
                        {errors.facilitiesInHospital?.[index]?.cost && (
                          <p className="mt-1 text-xs text-red-500">
                            {
                              (errors.facilitiesInHospital[index]?.cost?.message as string)
                                
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={facility.description}
                          onChange={(e) =>
                            handleFacilityChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Description of the facility"
                          rows={2}
                        />
                        {errors.facilitiesInHospital?.[index]?.description && (
                          <p className="mt-1 text-xs text-red-500">
                            {
                              (
                                errors.facilitiesInHospital[index]
                                  .description as FieldError
                              ).message
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Availability Status
                        </label>
                        <select
                          value={facility.isAvailable.toString()}
                          onChange={(e) =>
                            handleFacilityChange(
                              index,
                              "isAvailable",
                              e.target.value === "true"
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="true">Available</option>
                          <option value="false">Not Available</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Registering..." : "Complete Registration"}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login/hospital"
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
