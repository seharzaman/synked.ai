import { z } from "zod";

export const insightCreateSchema = z.object({
  industry: z.string().min(1, "Industry is required").max(100),
  category: z.string().min(1, "Category is required").max(100),
  finding: z.string().min(1, "Finding is required").max(5000),
  evidenceCount: z.number().int().min(1).default(1),
  avgROI: z.string().max(500).optional(),
  relatedBlueprintIds: z.array(z.string()).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const insightUpdateSchema = insightCreateSchema.partial();

export type InsightCreate = z.infer<typeof insightCreateSchema>;
export type InsightUpdate = z.infer<typeof insightUpdateSchema>;
