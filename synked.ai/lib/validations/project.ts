import { z } from "zod";

export const projectCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(5000).optional(),
  status: z
    .enum(["discovery", "active", "delivered", "paused"])
    .default("discovery"),
  industry: z.string().max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().min(0).optional(),
  companyId: z.string().optional(),
  clientId: z.string().optional(),
  auditId: z.string().optional(),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
