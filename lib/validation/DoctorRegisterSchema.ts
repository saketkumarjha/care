import { z } from "zod";

// Doctor location schema
const locationSchema = z.object({
  addressline1: z.string().min(1, { message: "Address line 1 is required" }),
  addressLine2: z.string().min(1, { message: "Address line 2 is required" }),
  addressLine3: z.string().min(1, { message: "Address line 3 is required" }),
  isPrimaryLocation: z.boolean().default(true),
});

// Exception schema for time slots
const exceptionSchema = z.object({
  expectedDateOfException: z
    .string()
    .min(1, { message: "Exception date is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

// Time slot schema
const slotSchema = z.object({
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  maxPatientsInTheSlot: z
    .number()
    .min(1, { message: "Maximum patients must be at least 1" }),
  isActive: z.boolean().default(true),
  status: z.string().default("ACTIVE"),
  recurring: z.boolean().default(true),
  exceptions: z.array(exceptionSchema).default([]),
});

// Day slot schema
const daySlotSchema = z.object({
  dayName: z.string().min(1, { message: "Day name is required" }),
  slots: z
    .array(slotSchema)
    .min(1, { message: "At least one time slot is required" }),
});

// Hospital joined schema
const hospitalJoinedSchema = z.object({
  hospitalId: z.string().min(1, { message: "Hospital ID is required" }),
  whenJoined: z.string().min(1, { message: "Joining date is required" }),
  whenLeft: z.string().nullable().optional(),
  isJoined: z.boolean().default(true),
});

// Doctor schema
export const doctorSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .min(4, { message: "Username must be at least 4 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),
  name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  specialization: z.string().min(1, { message: "Specialization is required" }),
  licenseNumber: z.string().min(1, { message: "License number is required" }),
  yearsOfExperience: z
    .number()
    .min(0, { message: "Years of experience must be a positive number" }),
  consultationFee: z
    .number()
    .min(0, { message: "Consultation fee must be a positive number" }),
  averageConsultationTime: z
    .number()
    .min(1, { message: "Average consultation time must be at least 1 minute" }),
  locationsOfDoctor: z
    .array(locationSchema)
    .min(1, { message: "At least one location is required" }),
  timeSlots: z
    .array(daySlotSchema)
    .min(1, { message: "At least one day with time slots is required" }),
  hospitalJoined: z.array(hospitalJoinedSchema).optional().default([]),
  doctorImage: z.instanceof(File).optional(),
});

// You can also create a partial schema for updates if needed
export const updateDoctorSchema = doctorSchema.partial();

// Define the DaySlot type
interface DaySlot {
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
}

// Define the HospitalJoined type
interface HospitalJoined {
  hospitalId: string;
  whenJoined: string;
  whenLeft?: string | null;
  isJoined?: boolean;
}

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
  doctorImage?: string | File;
}
