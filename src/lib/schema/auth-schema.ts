import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  bio: z.string().nullable().optional(),
  role: z.string(),
  preferred_currency: z.string(),
});

export type User = z.infer<typeof userSchema>;

// login
export const loginInputSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const loginResponseSchema = z.object({
  refresh: z.string(),
  access: z.string(),
  user: z.object({
    id: z.string(),
    email: z.email(),
    full_name: z.string(),
    role: z.string(),
  }),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

// register
export const registerObjectSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number must be valid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  re_password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CLIENT", "VENDOR", "ADMIN"]),
});

export const registerInputSchema = registerObjectSchema.refine(
  (data) => data.password === data.re_password,
  {
    message: "Passwords do not match",
    path: ["re_password"],
  }
);

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const registerResponseSchema = z.object({
  refresh: z.string(),
  access: z.string(),
  user: userSchema,
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// verify email
export const verifyEmailInputSchema = z.object({
  email: z.email(),
  code: z.string().min(6, "Token must be at least 6 characters"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailInputSchema>;

export const verifyEmailResponseSchema = z.object({
  message: z.string().optional(),
  success: z.boolean().optional(),
});

export type VerifyEmailResponse = z.infer<typeof verifyEmailResponseSchema>;

// set password
export const setPasswordInputSchema = z
  .object({
    uidb64: z.string(),
    token: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    re_password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.re_password, {
    message: "Passwords do not match",
    path: ["re_password"],
  });

export type SetPasswordInput = z.infer<typeof setPasswordInputSchema>;

export const setPasswordResponseSchema = z.object({
  message: z.string(),
  access: z.string(),
  refresh: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    full_name: z.string(),
    role: z.string(),
  }),
});

export type SetPasswordResponse = z.infer<typeof setPasswordResponseSchema>;
