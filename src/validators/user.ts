import { z } from "zod";

export const userCreateSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8),
  role: z.enum(["CITIZEN", "STAFF", "ADMIN"]),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(["CITIZEN", "STAFF", "ADMIN"]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;