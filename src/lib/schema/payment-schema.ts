import { z } from "zod";

export const cashTransactionInputSchema = z.object({
  amount: z.number().min(1),
  phone_number: z
    .string()
    .min(10)
    .regex(/^\d+$/, "Phone number must be numeric"),
});

export type CashTransactionInput = z.infer<typeof cashTransactionInputSchema>;

export const paymentResponseSchema = z.object({
  transaction_id: z.string(),
  status: z.string(),
  amount: z.number(),
  message: z.string().optional(),
});

export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
