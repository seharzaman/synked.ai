import { z } from "zod";

export const clientCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  phone: z.string().max(50).optional(),
  title: z.string().max(100).optional(),
  status: z.enum(["active", "inactive", "lead"]).default("lead"),
  notes: z.string().max(2000).optional(),
  companyId: z.string().optional().nullable(),
});

export const clientUpdateSchema = clientCreateSchema.partial();

export type ClientCreate = z.infer<typeof clientCreateSchema>;
export type ClientUpdate = z.infer<typeof clientUpdateSchema>;
