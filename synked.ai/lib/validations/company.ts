import { z } from "zod";

export const companyCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  industry: z.string().max(100).optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "prospect"]).default("prospect"),
  notes: z.string().max(2000).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export const companyUpdateSchema = companyCreateSchema.partial();

export type CompanyCreate = z.infer<typeof companyCreateSchema>;
export type CompanyUpdate = z.infer<typeof companyUpdateSchema>;
