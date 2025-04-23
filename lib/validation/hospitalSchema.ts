import { z } from "zod";

// Facility schema
const facilitySchema = z.object({
  name: z.string().min(1, { message: "Facility name is required" }),
  description: z
    .string()
    .min(1, { message: "Facility description is required" }),
  cost: z.number().min(0, { message: "Cost must be a positive number" }),
  isAvailable: z.boolean().default(true),
});

// Address schema
const addressSchema = z.object({
  addressLine1: z.string().min(1, { message: "Address line 1 is required" }),
  addressLine2: z.string().min(1, { message: "Address line 2 is required" }),
  addressLine3: z.string().min(1, { message: "Address line 3 is required" }),
});

// Hospital schema
export const hospitalSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .min(4, { message: "Username must be at least 4 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),
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
  hospitalAddress: addressSchema,
  contactNumberOfHospital: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must be at most 15 digits" }),
  emailOfHospital: z.string().email({ message: "Invalid email address" }),
  licenseNumberOfHospital: z
    .string()
    .min(1, { message: "License number is required" }),
  ratingOfHospital: z.number().min(0).max(5).default(0).optional(),
  isActive: z.boolean().default(true).optional(),
  // Making hospitalImages optional
  hospitalImages: z.array(z.instanceof(File)).optional().default([]),
  facilitiesInHospital: z
    .array(facilitySchema)
    .min(1, { message: "At least one facility is required" }),
  doctorUnderHospitalID: z.array(z.string()).default([]).optional(),
  adminsInTheHospital: z.array(z.string()).default([]).optional(),
});

// You can also create a partial schema for updates if needed
export const updateHospitalSchema = hospitalSchema.partial();