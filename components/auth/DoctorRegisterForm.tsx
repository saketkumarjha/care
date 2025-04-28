"use client";
import React, { useState } from "react";
import { z } from "zod";
import { doctorSchema } from "../../lib/validation/DoctorRegisterSchema"; // Import your existing schema
import { registerDoctor, convertFileToBase64 } from "../../lib/api/doctor"; // Import your API functions
import Image from "next/image";

// Type for form errors
type FormErrors = {
  [key: string]: string[];
};

type DoctorFormData = {
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
    status: string;
    whenJoined: string;
    whenLeft: string | null;
    isJoined: boolean;
  }[];
  doctorImage?: File | null;
};

const DoctorRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<DoctorFormData>({
    username: "",
    name: "",
    email: "",
    password: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: 0,
    consultationFee: 0,
    averageConsultationTime: 0,
    locationsOfDoctor: [
      {
        addressline1: "",
        addressLine2: "",
        addressLine3: "",
        isPrimaryLocation: true,
      },
    ],
    timeSlots: [],
    hospitalJoined: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState("basic"); // 'basic', 'locations', 'timeSlots', 'hospitals'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [doctorImage, setDoctorImage] = useState<File | null>(null);

  // Basic input change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const convertedValue = type === "number" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: convertedValue,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDoctorImage(e.target.files[0]);
    }
  };

  // Handle location changes
  const handleLocationChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedLocations = [...formData.locationsOfDoctor];
    updatedLocations[index] = {
      ...updatedLocations[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      locationsOfDoctor: updatedLocations,
    }));
  };

  // Add new location
  const addLocation = () => {
    setFormData((prev) => ({
      ...prev,
      locationsOfDoctor: [
        ...prev.locationsOfDoctor,
        {
          addressline1: "",
          addressLine2: "",
          addressLine3: "",
          isPrimaryLocation: false,
        },
      ],
    }));
  };

  // Remove location
  const removeLocation = (index: number) => {
    const updatedLocations = [...formData.locationsOfDoctor];
    updatedLocations.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      locationsOfDoctor: updatedLocations,
    }));
  };

  // Handle time slot changes
  const handleDaySlotChange = (
    dayIndex: number,
    field: string,
    value: string
  ) => {
    const updatedTimeSlots = [...formData.timeSlots];
    updatedTimeSlots[dayIndex] = {
      ...updatedTimeSlots[dayIndex],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      timeSlots: updatedTimeSlots,
    }));
  };

  // Handle individual slot changes within a day
  const handleSlotChange = (
    dayIndex: number,
    slotIndex: number,
    field: string,
    value: string | number | boolean
  ) => {
    const updatedTimeSlots = [...formData.timeSlots];
    updatedTimeSlots[dayIndex].slots[slotIndex] = {
      ...updatedTimeSlots[dayIndex].slots[slotIndex],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      timeSlots: updatedTimeSlots,
    }));
  };

  // Add new day slot
  const addDaySlot = () => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: [
        ...prev.timeSlots,
        {
          dayName: "",
          slots: [
            {
              startTime: "",
              endTime: "",
              maxPatientsInTheSlot: 1,
              isActive: true,
              status: "ACTIVE",
              recurring: true,
              exceptions: [],
            },
          ],
        },
      ],
    }));
  };

  // Add new slot to a day
  const addSlotToDay = (dayIndex: number) => {
    const updatedTimeSlots = [...formData.timeSlots];
    updatedTimeSlots[dayIndex].slots.push({
      startTime: "",
      endTime: "",
      maxPatientsInTheSlot: 1,
      isActive: true,
      status: "ACTIVE",
      recurring: true,
      exceptions: [],
    });

    setFormData((prev) => ({
      ...prev,
      timeSlots: updatedTimeSlots,
    }));
  };

  // Remove slot from a day
  const removeSlotFromDay = (dayIndex: number, slotIndex: number) => {
    const updatedTimeSlots = [...formData.timeSlots];
    updatedTimeSlots[dayIndex].slots.splice(slotIndex, 1);

    setFormData((prev) => ({
      ...prev,
      timeSlots: updatedTimeSlots,
    }));
  };

  // Handle exception changes
  const handleExceptionChange = (
    dayIndex: number,
    slotIndex: number,
    exceptionIndex: number,
    field: string,
    value: string
  ) => {
    const updatedTimeSlots = [...formData.timeSlots];
    updatedTimeSlots[dayIndex].slots[slotIndex].exceptions[exceptionIndex] = {
      ...updatedTimeSlots[dayIndex].slots[slotIndex].exceptions[exceptionIndex],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      timeSlots: updatedTimeSlots,
    }));
  };

  // Add exception to a slot
  const addExceptionToSlot = (dayIndex: number, slotIndex: number) => {
    const updatedTimeSlots = [...formData.timeSlots];
    updatedTimeSlots[dayIndex].slots[slotIndex].exceptions.push({
      expectedDateOfException: "",
      status: "DAY_OFF",
    });

    setFormData((prev) => ({
      ...prev,
      timeSlots: updatedTimeSlots,
    }));
  };

  // Remove exception from a slot
  const removeExceptionFromSlot = (
    dayIndex: number,
    slotIndex: number,
    exceptionIndex: number
  ) => {
    const updatedTimeSlots = [...formData.timeSlots];
    updatedTimeSlots[dayIndex].slots[slotIndex].exceptions.splice(
      exceptionIndex,
      1
    );

    setFormData((prev) => ({
      ...prev,
      timeSlots: updatedTimeSlots,
    }));
  };

  // Handle hospital changes
  const handleHospitalChange = (
    index: number,
    field: string,
    value: string | boolean | null
  ) => {
    const updatedHospitals = [...formData.hospitalJoined];
    updatedHospitals[index] = {
      ...updatedHospitals[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      hospitalJoined: updatedHospitals,
    }));
  };

  // Add new hospital
  const addHospital = () => {
    setFormData((prev) => ({
      ...prev,
      hospitalJoined: [
        ...prev.hospitalJoined,
        {
          hospitalId: "",
          status: "",
          whenJoined: "",
          whenLeft: null,
          isJoined: true,
        },
      ],
    }));
  };

  // Remove hospital
  const removeHospital = (index: number) => {
    const updatedHospitals = [...formData.hospitalJoined];
    updatedHospitals.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      hospitalJoined: updatedHospitals,
    }));
  };

  // Validate the form data
  const validateForm = () => {
    try {
      // Need to create a submission object that matches the schema
      const submissionData = {
        ...formData,
      };

      // Add the image file if present for schema validation
      if (doctorImage) {
        submissionData.doctorImage = doctorImage;
      }

      // Parse with zod schema
      doctorSchema.parse(submissionData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(err.message);
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data before submission:", formData);

    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError(
        errors
          ? "Please fix the errors"
          : "something is necessary to be filled go back"
      );
      console.log("validation success", formData);

      try {
        // Convert image to base64 if exists
        let base64Image = undefined;
        if (doctorImage) {
          base64Image = await convertFileToBase64(doctorImage);
        }

        // Create submission data
        const submissionData = {
          ...formData,
          doctorImage: base64Image,
        };

        // Send data to API
        const response = await registerDoctor(submissionData);

        if (response.success) {
          setSubmitSuccess(true);
          // Reset form or redirect as needed
        } else {
          setSubmitError(response.message || "Registration failed");
        }
      } catch (error) {
        setSubmitError("An unexpected error occurred");
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Get error for a field
  const getFieldError = (fieldName: string) => {
    
    return errors[fieldName] ? errors[fieldName][0] : "";
  };

  // CSS classes
  const inputClass =
    "mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50";
  const errorClass = "text-red-500 text-sm mt-1";
  const buttonClass =
    "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50";
  const secondaryButtonClass =
    "px-4 py-2 bg-white border border-green-600 text-green-600 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50";
  const tabClass = "px-4 py-2 rounded-t-md focus:outline-none";
  const activeTabClass = `${tabClass} bg-green-600 text-white`;
  const inactiveTabClass = `${tabClass} bg-green-100 text-green-800 hover:bg-green-200`;
  const cardClass = "bg-white rounded-lg shadow-md p-6 mb-6";
  const labelClass = "block text-sm font-medium text-gray-700";
  const checkboxClass =
    "h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded";

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            Doctor Registration
          </h1>
          <p className="text-gray-600">
            Complete the form below to register as a doctor on our platform
          </p>
        </div>

        {submitSuccess ? (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">
              {" "}
              Your registration has been submitted successfully.
            </span>
          </div>
        ) : null}

        {submitError ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {submitError}</span>
          </div>
        ) : null}

        <div className="flex space-x-2 mb-6">
          <button
            type="button"
            className={
              activeTab === "basic" ? activeTabClass : inactiveTabClass
            }
            onClick={() => setActiveTab("basic")}
          >
            Basic Information
          </button>
          <button
            type="button"
            className={
              activeTab === "locations" ? activeTabClass : inactiveTabClass
            }
            onClick={() => setActiveTab("locations")}
          >
            Locations
          </button>
          <button
            type="button"
            className={
              activeTab === "timeSlots" ? activeTabClass : inactiveTabClass
            }
            onClick={() => setActiveTab("timeSlots")}
          >
            Time Slots
          </button>
          <button
            type="button"
            className={
              activeTab === "hospitals" ? activeTabClass : inactiveTabClass
            }
            onClick={() => setActiveTab("hospitals")}
          >
            Hospitals
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          {activeTab === "basic" && (
            <div className={cardClass}>
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className={labelClass}>
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {getFieldError("username") && (
                    <p className={errorClass}>{getFieldError("username")}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {getFieldError("name") && (
                    <p className={errorClass}>{getFieldError("name")}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {getFieldError("email") && (
                    <p className={errorClass}>{getFieldError("email")}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {getFieldError("password") && (
                    <p className={errorClass}>{getFieldError("password")}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters with uppercase,
                    lowercase, number and special character
                  </p>
                </div>

                <div>
                  <label htmlFor="specialization" className={labelClass}>
                    Specialization
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {getFieldError("specialization") && (
                    <p className={errorClass}>
                      {getFieldError("specialization")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="licenseNumber" className={labelClass}>
                    License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {getFieldError("licenseNumber") && (
                    <p className={errorClass}>
                      {getFieldError("licenseNumber")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="yearsOfExperience" className={labelClass}>
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                  />
                  {getFieldError("yearsOfExperience") && (
                    <p className={errorClass}>
                      {getFieldError("yearsOfExperience")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="consultationFee" className={labelClass}>
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    id="consultationFee"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                  />
                  {getFieldError("consultationFee") && (
                    <p className={errorClass}>
                      {getFieldError("consultationFee")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="averageConsultationTime"
                    className={labelClass}
                  >
                    Average Consultation Time ( minutes)
                  </label>
                  <input
                    type="number"
                    id="averageConsultationTime"
                    name="averageConsultationTime"
                    value={formData.averageConsultationTime}
                    onChange={handleChange}
                    className={inputClass}
                    min="5"
                  />
                  {getFieldError("averageConsultationTime") && (
                    <p className={errorClass}>
                      {getFieldError("averageConsultationTime")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="doctorImage" className={labelClass}>
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    id="doctorImage"
                    name="doctorImage"
                    onChange={handleImageUpload}
                    className={inputClass}
                    accept="image/*"
                  />
                  {doctorImage && (
                    <div className="mt-2">
                      <Image
                        width={100}
                        height={100}
                        src={URL.createObjectURL(doctorImage)}
                        alt="Doctor preview"
                        className="h-24 w-24 object-cover rounded-full"
                      />
                    </div>
                  )}
                  {getFieldError("doctorImage") && (
                    <p className={errorClass}>{getFieldError("doctorImage")}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Locations Section */}
          {activeTab === "locations" && (
            <div className={cardClass}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-green-800">
                  Practice Locations
                </h2>
                <button
                  type="button"
                  onClick={addLocation}
                  className={secondaryButtonClass}
                >
                  Add Location
                </button>
              </div>

              {formData.locationsOfDoctor.length === 0 && (
                <p className="text-gray-500">
                  No locations added yet. Click the button above to add a
                  location.
                </p>
              )}

              {formData.locationsOfDoctor.map((location, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 mb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Location {index + 1}</h3>
                    {formData.locationsOfDoctor.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Address Line 1</label>
                      <input
                        type="text"
                        value={location.addressline1}
                        onChange={(e) =>
                          handleLocationChange(
                            index,
                            "addressline1",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                      {getFieldError(
                        `locationsOfDoctor.${index}.addressline1`
                      ) && (
                        <p className={errorClass}>
                          {getFieldError(
                            `locationsOfDoctor.${index}.addressline1`
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Address Line 2</label>
                      <input
                        type="text"
                        value={location.addressLine2}
                        onChange={(e) =>
                          handleLocationChange(
                            index,
                            "addressLine2",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                      {getFieldError(
                        `locationsOfDoctor.${index}.addressLine2`
                      ) && (
                        <p className={errorClass}>
                          {getFieldError(
                            `locationsOfDoctor.${index}.addressLine2`
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Address Line 3</label>
                      <input
                        type="text"
                        value={location.addressLine3}
                        onChange={(e) =>
                          handleLocationChange(
                            index,
                            "addressLine3",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                      {getFieldError(
                        `locationsOfDoctor.${index}.addressLine3`
                      ) && (
                        <p className={errorClass}>
                          {getFieldError(
                            `locationsOfDoctor.${index}.addressLine3`
                          )}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`isPrimaryLocation-${index}`}
                        checked={location.isPrimaryLocation}
                        onChange={(e) =>
                          handleLocationChange(
                            index,
                            "isPrimaryLocation",
                            e.target.checked
                          )
                        }
                        className={checkboxClass}
                      />
                      <label
                        htmlFor={`isPrimaryLocation-${index}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        Primary Location
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Time Slots Section */}
          {activeTab === "timeSlots" && (
            <div className={cardClass}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-green-800">
                  Weekly Time Slots
                </h2>
                <button
                  type="button"
                  onClick={addDaySlot}
                  className={secondaryButtonClass}
                >
                  Add Day
                </button>
              </div>

              {formData.timeSlots.length === 0 && (
                <p className="text-gray-500">
                  No time slots added yet. Click the button above to add a day.
                </p>
              )}

              {formData.timeSlots.map((daySlot, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border border-gray-200 rounded-md p-4 mb-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <label className={labelClass}>Day:</label>
                      <select
                        value={daySlot.dayName}
                        onChange={(e) =>
                          handleDaySlotChange(
                            dayIndex,
                            "dayName",
                            e.target.value
                          )
                        }
                        className="rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      >
                        <option value="">Select a day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => addSlotToDay(dayIndex)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Add Slot
                      </button>
                      {formData.timeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedTimeSlots = [...formData.timeSlots];
                            updatedTimeSlots.splice(dayIndex, 1);
                            setFormData((prev) => ({
                              ...prev,
                              timeSlots: updatedTimeSlots,
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove Day
                        </button>
                      )}
                    </div>
                  </div>

                  {getFieldError(`timeSlots.${dayIndex}.dayName`) && (
                    <p className={errorClass}>
                      {getFieldError(`timeSlots.${dayIndex}.dayName`)}
                    </p>
                  )}

                  {daySlot.slots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="border border-gray-100 bg-gray-50 rounded-md p-4 mb-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">
                          Time Slot {slotIndex + 1}
                        </h4>
                        {daySlot.slots.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeSlotFromDay(dayIndex, slotIndex)
                            }
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove Slot
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className={labelClass}>Start Time</label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleSlotChange(
                                dayIndex,
                                slotIndex,
                                "startTime",
                                e.target.value
                              )
                            }
                            className={inputClass}
                          />
                          {getFieldError(
                            `timeSlots.${dayIndex}.slots.${slotIndex}.startTime`
                          ) && (
                            <p className={errorClass}>
                              {getFieldError(
                                `timeSlots.${dayIndex}.slots.${slotIndex}.startTime`
                              )}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={labelClass}>End Time</label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleSlotChange(
                                dayIndex,
                                slotIndex,
                                "endTime",
                                e.target.value
                              )
                            }
                            className={inputClass}
                          />
                          {getFieldError(
                            `timeSlots.${dayIndex}.slots.${slotIndex}.endTime`
                          ) && (
                            <p className={errorClass}>
                              {getFieldError(
                                `timeSlots.${dayIndex}.slots.${slotIndex}.endTime`
                              )}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={labelClass}>Max Patients</label>
                          <input
                            type="number"
                            value={slot.maxPatientsInTheSlot}
                            onChange={(e) =>
                              handleSlotChange(
                                dayIndex,
                                slotIndex,
                                "maxPatientsInTheSlot",
                                parseInt(e.target.value, 10)
                              )
                            }
                            className={inputClass}
                            min="1"
                          />
                          {getFieldError(
                            `timeSlots.${dayIndex}.slots.${slotIndex}.maxPatientsInTheSlot`
                          ) && (
                            <p className={errorClass}>
                              {getFieldError(
                                `timeSlots.${dayIndex}.slots.${slotIndex}.maxPatientsInTheSlot`
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`isActive-${dayIndex}-${slotIndex}`}
                            checked={slot.isActive}
                            onChange={(e) =>
                              handleSlotChange(
                                dayIndex,
                                slotIndex,
                                "isActive",
                                e.target.checked
                              )
                            }
                            className={checkboxClass}
                          />
                          <label
                            htmlFor={`isActive-${dayIndex}-${slotIndex}`}
                            className="text-sm font-medium text-gray-700"
                          >
                            Active
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`recurring-${dayIndex}-${slotIndex}`}
                            checked={slot.recurring}
                            onChange={(e) =>
                              handleSlotChange(
                                dayIndex,
                                slotIndex,
                                "recurring",
                                e.target.checked
                              )
                            }
                            className={checkboxClass}
                          />
                          <label
                            htmlFor={`recurring-${dayIndex}-${slotIndex}`}
                            className="text-sm font-medium text-gray-700"
                          >
                            Recurring
                          </label>
                        </div>

                        <div>
                          <label className={labelClass}>Status</label>
                          <select
                            value={slot.status}
                            onChange={(e) =>
                              handleSlotChange(
                                dayIndex,
                                slotIndex,
                                "status",
                                e.target.value
                              )
                            }
                            className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="BUSY">Busy</option>
                          </select>
                        </div>
                      </div>

                      {/* Exceptions Section */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-sm">Exceptions</h5>
                          <button
                            type="button"
                            onClick={() =>
                              addExceptionToSlot(dayIndex, slotIndex)
                            }
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Add Exception
                          </button>
                        </div>

                        {slot.exceptions.length === 0 && (
                          <p className="text-gray-500 text-sm italic">
                            No exceptions added yet.
                          </p>
                        )}

                        {slot.exceptions.map((exception, exceptionIndex) => (
                          <div
                            key={exceptionIndex}
                            className="border border-gray-100 bg-white rounded p-3 mb-2 flex items-center justify-between"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                              <div>
                                <label className="text-xs font-medium text-gray-700">
                                  Exception Date
                                </label>
                                <input
                                  type="date"
                                  value={exception.expectedDateOfException}
                                  onChange={(e) =>
                                    handleExceptionChange(
                                      dayIndex,
                                      slotIndex,
                                      exceptionIndex,
                                      "expectedDateOfException",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-sm"
                                />
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-700">
                                  Status
                                </label>
                                <select
                                  value={exception.status}
                                  onChange={(e) =>
                                    handleExceptionChange(
                                      dayIndex,
                                      slotIndex,
                                      exceptionIndex,
                                      "status",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-sm"
                                >
                                  <option value="DAY_OFF">Day Off</option>
                                  <option value="LEAVE">Leave</option>
                                  <option value="HOLIDAY">Holiday</option>
                                </select>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeExceptionFromSlot(
                                  dayIndex,
                                  slotIndex,
                                  exceptionIndex
                                )
                              }
                              className="ml-4 text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Hospitals Section */}
          {activeTab === "hospitals" && (
            <div className={cardClass}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-green-800">
                  Hospital Affiliations
                </h2>
                <button
                  type="button"
                  onClick={addHospital}
                  className={secondaryButtonClass}
                >
                  Add Hospital
                </button>
              </div>

              {formData.hospitalJoined.length === 0 && (
                <p className="text-gray-500">
                  No hospital affiliations added yet. Click the button above to
                  add a hospital.
                </p>
              )}

              {formData.hospitalJoined.map((hospital, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 mb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Hospital {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeHospital(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Hospital ID</label>
                      <input
                        type="text"
                        value={hospital.hospitalId}
                        onChange={(e) =>
                          handleHospitalChange(
                            index,
                            "hospitalId",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                      {getFieldError(`hospitalJoined.${index}.hospitalId`) && (
                        <p className={errorClass}>
                          {getFieldError(`hospitalJoined.${index}.hospitalId`)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Date Joined</label>
                      <input
                        type="date"
                        value={hospital.whenJoined}
                        onChange={(e) =>
                          handleHospitalChange(
                            index,
                            "whenJoined",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                      {getFieldError(`hospitalJoined.${index}.whenJoined`) && (
                        <p className={errorClass}>
                          {getFieldError(`hospitalJoined.${index}.whenJoined`)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>
                        Date Left (if applicable)
                      </label>
                      <input
                        type="date"
                        value={hospital.whenLeft || ""}
                        onChange={(e) =>
                          handleHospitalChange(
                            index,
                            "whenLeft",
                            e.target.value || null
                          )
                        }
                        className={inputClass}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`isJoined-${index}`}
                        checked={hospital.isJoined}
                        onChange={(e) =>
                          handleHospitalChange(
                            index,
                            "isJoined",
                            e.target.checked
                          )
                        }
                        className={checkboxClass}
                      />
                      <label
                        htmlFor={`isJoined-${index}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        Currently Affiliated
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => {
                // Navigate between tabs
                const tabs = ["basic", "locations", "timeSlots", "hospitals"];
                const currentIndex = tabs.indexOf(activeTab);
                const prevIndex =
                  currentIndex > 0 ? currentIndex - 1 : currentIndex;
                setActiveTab(tabs[prevIndex]);
              }}
              className={secondaryButtonClass}
              disabled={activeTab === "basic"}
            >
              Previous
            </button>

            {activeTab !== "hospitals" ? (
              <button
                type="button"
                onClick={() => {
                  // Navigate between tabs
                  const tabs = ["basic", "locations", "timeSlots", "hospitals"];
                  const currentIndex = tabs.indexOf(activeTab);
                  const nextIndex =
                    currentIndex < tabs.length - 1
                      ? currentIndex + 1
                      : currentIndex;
                  setActiveTab(tabs[nextIndex]);
                }}
                className={buttonClass}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={buttonClass}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Register"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistrationForm;
