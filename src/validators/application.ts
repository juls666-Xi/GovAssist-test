import { z } from "zod";

export const applicationSubmitSchema = z.object({
  programId: z.string().min(1, "Program is required"),
});

export type ApplicationSubmitInput = z.infer<typeof applicationSubmitSchema>;

export const applicationReviewSchema = z.object({
  status: z.enum(["PENDING", "REVIEWING", "APPROVED", "REJECTED", "CLAIMED"]),
  remarks: z.string().max(2000).optional(),
});

export type ApplicationReviewInput = z.infer<typeof applicationReviewSchema>;

export const scheduleSchema = z.object({
  applicationId: z.string().min(1, "Application is required"),
  date: z.coerce.date(),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location must be at least 3 characters").max(500),
});

export type ScheduleInput = z.infer<typeof scheduleSchema>;