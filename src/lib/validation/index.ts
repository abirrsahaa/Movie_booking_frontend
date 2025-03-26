import * as z from "zod"

export const SignupValidation = z.object({
    name: z.string().min(2,{message: "Too short"}),
    email: z.string().email({message: "Email is not valid"}),
    password: z.string().min(6, {message: "Password is too short"}),
    phone: z.string()
    .optional()
    .refine(phone => !phone || /^[0-9]{10}$/.test(phone), {
      message: "Invalid mobile number. It should be empty or 10 digits.",
    }),
    address: z.string().optional(),
})

export const LoginValidation = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  });

  export const OtpValidation = z.object({
    otp : z.string().min(4).max(4)
  });  