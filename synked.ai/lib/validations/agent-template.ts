import { z } from "zod";

const teamAgentSchema = z.object({
  role: z.string().min(1).max(100),
  systemPrompt: z.string().min(1),
  canDelegateTo: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
});

const teamConfigSchema = z.object({
  coordination: z.enum(["orchestrator", "autonomous", "hybrid"]),
  agents: z.array(teamAgentSchema).min(2),
  routing: z
    .object({
      type: z.enum(["llm", "rules", "round_robin"]),
      rules: z.array(z.record(z.string(), z.unknown())).optional(),
    })
    .optional(),
});

export const agentTemplateCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(5000).optional(),
  type: z.string().min(1).max(100),
  graphPattern: z
    .enum([
      "conversational",
      "pipeline",
      "reactive",
      "team_orchestrator",
      "team_autonomous",
    ])
    .default("conversational"),
  baseConfig: z.record(z.string(), z.unknown()).optional(),
  systemPrompt: z.string().max(50000).optional(),
  teamConfig: teamConfigSchema.optional(),
  category: z.string().max(100).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const agentTemplateUpdateSchema = agentTemplateCreateSchema.partial();

export type AgentTemplateCreate = z.infer<typeof agentTemplateCreateSchema>;
export type AgentTemplateUpdate = z.infer<typeof agentTemplateUpdateSchema>;
export type TeamConfig = z.infer<typeof teamConfigSchema>;
