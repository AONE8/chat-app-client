import * as z from "zod";

export const Login = z.object({
  email: z.email("Invalid e-mail").trim(),
  password: z
    .string("Invalid password")
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters"),
});

export type LoginType = z.infer<typeof Login>;
