import { z } from "zod";

const blueprintStepSchema = z.object({
  order: z.number().int().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(["setup", "config", "deploy", "test", "handoff"]),
  estimatedMinutes: z.number().int().min(0).optional(),
  tools: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
});

export const blueprintCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().max(5000).optional(),
  industry: z.string().max(100).optional(),
  category: z.enum(["agent", "workflow", "rag", "full_system"]),
  steps: z.array(blueprintStepSchema).min(1, "At least one step is required"),
  estimatedHours: z.number().int().min(0).optional(),
  estimatedROI: z.string().max(500).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const blueprintUpdateSchema = blueprintCreateSchema.partial();

export type BlueprintCreate = z.infer<typeof blueprintCreateSchema>;
export type BlueprintUpdate = z.infer<typeof blueprintUpdateSchema>;
export type BlueprintStep = z.infer<typeof blueprintStepSchema>;
