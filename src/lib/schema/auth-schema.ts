import z from "zod";

export const loginBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const loginResponseSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    full_name: z.string(),
    phone_number: z.string(),
    role: z.string(),
  }),
});

export const registerBodySchema = z.object({
  full_name: z.string(),
  email: z.email(),
  phone_number: z.string(),
  password: z.string().min(8),
  re_password: z.string().min(8),
  role: z.string(),
});

export const registerResponseSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    full_name: z.string(),
    phone_number: z.string(),
    role: z.string(),
  }),
});

