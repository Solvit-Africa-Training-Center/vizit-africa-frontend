import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  full_name: z.string(),
  phone_number: z.string(),
  role: z.string(),
});

export type User = z.infer<typeof userSchema>;

// login
export const loginInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const loginResponseSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  user: userSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

// register
export const registerInputSchema = z
  .object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().min(10, "Phone number must be valid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    re_password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["CLIENT", "VENDOR", "ADMIN"]).default("CLIENT"),
  })
  .refine((data) => data.password === data.re_password, {
    message: "Passwords do not match",
    path: ["re_password"],
  });

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const registerResponseSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  user: userSchema,
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// verify email
export const verifyEmailInputSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, "Code must be at least 6 characters"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailInputSchema>;

export const verifyEmailResponseSchema = z.object({
  message: z.string().optional(),
  success: z.boolean().optional(),
});

export type VerifyEmailResponse = z.infer<typeof verifyEmailResponseSchema>;
