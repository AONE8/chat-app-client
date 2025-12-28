import * as z from "zod";
export const Signup = z
  .object({
    username: z
      .string("Invalid username")
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters"),
    alias: z.preprocess(
      (alias) => (alias === "" ? undefined : alias),
      z
        .string("Invalid alias")
        .trim()
        .regex(
          /^[a-z][a-z0-9_]*$/,
          "Alias must start with a letter and contain only lowercase letters, numbers, and underscores"
        )
        .min(3, "Alias must be at least 3 characters")
        .max(20, "Alias must be at most 20 characters")
        .optional()
    ),
    email: z.email("Invalid e-mail").trim(),
    avatar: z.preprocess(
      (avatar) =>
        (avatar as File | undefined)?.size === 0 ? undefined : avatar,
      z
        .file("Invalid uploaded avatar file")
        .mime(
          ["image/jpeg", "image/png", "image/webp", "image/gif"],
          "Avatar file must be an image file ('image/png', 'image/jpeg', 'image/webp', 'image/gif')"
        )
        .max(5 * 1024 * 1024, "Avatar file size must be less than 5MB")
        .optional()
    ),
    phoneNumber: z.preprocess(
      (pN) => (pN === "" ? undefined : pN),
      z
        .e164("Invalid phone number")
        .trim()
        .transform((e) => (e === "" ? undefined : e))
        .optional()
    ),
    description: z.preprocess(
      (d) => (d === "" ? undefined : d),
      z
        .string("Invalid description")
        .trim()
        .max(255, "Description must be at most 255 characters")
        .optional()
    ),
    password: z
      .string("Invalid password")
      .trim()
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must be at most 30 characters"),
    passwordConfirmation: z.string("Invalid password confirmation").trim(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    error: "Passwords do not match",
  });

export type SignupType = z.infer<typeof Signup>;
