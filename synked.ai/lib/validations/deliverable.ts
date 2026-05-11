import { z } from "zod";

export const deliverableCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(5000).optional(),
  type: z.enum(["agent", "workflow", "integration", "custom"]),
  config: z.record(z.string(), z.unknown()).optional(),
  outcome: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().max(5000).optional(),
  projectId: z.string().min(1, "Project is required"),
  blueprintId: z.string().optional(),
  agentId: z.string().optional(),
  completedAt: z.string().optional(),
});

export const deliverableUpdateSchema = deliverableCreateSchema
  .partial()
  .omit({ projectId: true });

export type DeliverableCreate = z.infer<typeof deliverableCreateSchema>;
export type DeliverableUpdate = z.infer<typeof deliverableUpdateSchema>;
