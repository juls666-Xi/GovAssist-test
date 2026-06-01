import { z } from "zod";

export const programSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  requirements: z.string().min(10, "Requirements must be at least 10 characters").max(5000),
  budget: z.coerce.number().min(0).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "CLOSED"]),
});

export type ProgramInput = z.infer<typeof programSchema>;

export const programUpdateSchema = programSchema.partial();

export type ProgramUpdateInput = z.infer<typeof programUpdateSchema>;