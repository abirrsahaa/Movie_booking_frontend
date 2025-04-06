import * as z from "zod"

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Too short" }),
  email: z.string().email({ message: "Email is not valid" }),
  password: z.string().min(6, { message: "Password is too short" }),
  phone: z.string().min(10, { message: "Invalid mobile number" }).max(10, { message: "Invalid mobile number" }),
  address: z.string().min(2),
  recommendation: z.boolean().optional(),
})

export const LoginValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export const OtpValidation = z.object({
  otp: z.string().min(4).max(4)
});  