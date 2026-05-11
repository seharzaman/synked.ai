import { z } from "zod";

export const agentCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  type: z.string().min(1, "Type is required").max(50),
  status: z.enum(["ok", "degraded", "failing", "offline"]).default("offline"),
  description: z.string().max(2000).optional(),
  config: z.record(z.string(), z.unknown()).optional().nullable(),
  companyId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
});

export const agentUpdateSchema = agentCreateSchema.partial();

export const agentMetricsSchema = z.object({
  latency: z.number().min(0).optional(),
  successRate: z.number().min(0).max(100).optional(),
  errorCount: z.number().int().min(0).default(0),
  rpm: z.number().min(0).optional(),
  uptime: z.number().min(0).max(100).optional(),
});

export type AgentCreate = z.infer<typeof agentCreateSchema>;
export type AgentUpdate = z.infer<typeof agentUpdateSchema>;
export type AgentMetricsInput = z.infer<typeof agentMetricsSchema>;
