import { z } from "zod";

// Doctor login schema
export const doctorLoginSchema = z.object({
  // Email validation - must be a valid email format
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  
  // Password validation
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  
  // Optional doctor avatar file
  // This would typically be handled separately in most frameworks since it's a file
  doctorAvatar: z.any().optional(),
});

// Type definition derived from the schema
export type DoctorLoginInput = z.infer<typeof doctorLoginSchema>;

// Function to validate login input
// export function validateDoctorLogin(data: unknown) {
//   return doctorLoginSchema.safeParse(data);
// }