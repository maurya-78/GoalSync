import * as z from 'zod';

// Shared Login Validation
export const loginSchema = z.object({
  email: z.string().email("Invalid corporate email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Goal Item Validation
export const goalItemSchema = z.object({
  title: z.string().min(5, "Title is too short").max(100, "Title is too long"),
  weightage: z.number().min(1, "Weightage must be > 0").max(100, "Weightage cannot exceed 100"),
  target: z.string().min(1, "Target metric is required")
});

/**
 * Custom check for Goal Sheet 100% weightage
 */
export const isWeightageBalanced = (total) => total === 100;