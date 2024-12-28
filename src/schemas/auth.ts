import { z } from "zod";

export const getCurrentUserSchema = z.object({
  workspaceId: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters"),
});
