import { z } from "zod";

// ─── Greeting Node Output ─────────────────────────────────────────────────────

export const GreetingSchema = z.object({
  message: z
    .string()
    .describe(
      "A warm, professional greeting acknowledging the user by name and company. Tell them you're ready to analyze their website once they provide the URL. 2-3 sentences max.",
    ),
});

export type GreetingOutput = z.infer<typeof GreetingSchema>;

// ─── Analysis Node Output ─────────────────────────────────────────────────────

export const AnalysisSchema = z.object({
  summary: z
    .string()
    .describe(
      "A concise website analysis covering: tech stack, service offerings, business model, digital maturity, and automation opportunities. Reference specific pages and content found. 150-250 words. NEVER use placeholder text like '[mention services]'.",
    ),
  keyFindings: z
    .array(z.string())
    .describe(
      "3-5 key findings from the website crawl. Each should be a specific, actionable insight. Reference actual content found.",
    ),
});

export type AnalysisOutput = z.infer<typeof AnalysisSchema>;

// ─── Departments Node Output ──────────────────────────────────────────────────

export const DepartmentsSchema = z.object({
  departments: z
    .array(
      z.object({
        name: z
          .string()
          .describe(
            "Department or business area name (e.g., 'Customer Support', 'Sales Operations')",
          ),
        description: z
          .string()
          .describe(
            "1-2 sentence description of how AI could help this specific department, referencing their website content",
          ),
        relevance: z
          .number()
          .min(1)
          .max(10)
          .describe(
            "Relevance score 1-10 based on automation opportunity spotted from crawl data",
          ),
      }),
    )
    .min(4)
    .max(8)
    .describe(
      "4-8 departments/business areas that could benefit from AI automation, ordered by relevance (highest first)",
    ),
});

export type DepartmentsOutput = z.infer<typeof DepartmentsSchema>;
export type DepartmentSuggestion = DepartmentsOutput["departments"][number];

// ─── Question Node Output ─────────────────────────────────────────────────────

export const QuestionSchema = z.object({
  text: z
    .string()
    .describe(
      "The specific assessment question being asked. Clear and direct.",
    ),
  options: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe(
      "3-5 multiple choice options tailored to the user's business. Last option should be 'Other (please specify)' when appropriate.",
    ),
  context: z
    .string()
    .describe(
      "1-2 sentences explaining WHY this question matters for the assessment, referencing findings from their website analysis.",
    ),
  transition: z
    .string()
    .describe(
      "A brief (1 sentence) transitional comment connecting to the previous answer or analysis. Shows you're listening.",
    ),
});

export type QuestionOutput = z.infer<typeof QuestionSchema>;

// ─── Report Node Output ───────────────────────────────────────────────────────

const ScoreItemSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Score from 0-100 (higher = more problematic / more opportunity)",
    ),
  rationale: z
    .string()
    .describe(
      "1-2 sentence explanation for this score, referencing specific findings",
    ),
});

export const ReportSchema = z.object({
  scores: z
    .object({
      toolChaos: ScoreItemSchema.describe(
        "How fragmented and disconnected are their tools? High score = many disconnected tools, manual data transfer, no single source of truth.",
      ),
      leadLeakage: ScoreItemSchema.describe(
        "How many potential leads/customers are being lost? High score = no follow-up systems, slow response times, manual lead handling.",
      ),
      processFragmentation: ScoreItemSchema.describe(
        "How broken and manual are their internal processes? High score = lots of manual steps, no automation, repeated work.",
      ),
      communicationOverload: ScoreItemSchema.describe(
        "How overwhelmed are they by communication? High score = too many channels, no routing, manual responses to repetitive queries.",
      ),
      dataDisconnection: ScoreItemSchema.describe(
        "How siloed is their data? High score = data lives in separate systems, no unified view, manual reporting.",
      ),
    })
    .describe(
      "Five named operational health scores. Each measures a specific pain dimension.",
    ),
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Weighted average of all 5 scores. Represents overall operational dysfunction level — higher = more opportunity for AI automation.",
    ),
  scoreRationale: z
    .string()
    .describe(
      "2-3 sentence explanation for the overall score and top priority area",
    ),
  opportunities: z
    .array(
      z.object({
        title: z.string().describe("Name of the automation opportunity"),
        description: z
          .string()
          .describe(
            "What it does and why it matters for this specific business",
          ),
        impact: z
          .enum(["high", "medium", "low"])
          .describe("Expected impact level"),
        timeframe: z
          .string()
          .describe("Implementation timeframe (e.g., '2-4 weeks')"),
      }),
    )
    .min(3)
    .max(5)
    .describe("Top automation opportunities ranked by impact"),
  recommendedStack: z
    .array(
      z.object({
        tool: z.string().describe("Name of the tool or technology"),
        purpose: z.string().describe("What it's used for in their workflow"),
      }),
    )
    .min(3)
    .max(6)
    .describe("Recommended AI tools and technologies"),
  roadmap: z
    .array(
      z.object({
        phase: z.string().describe("Phase timeframe (e.g., 'Days 1-30')"),
        title: z.string().describe("Phase title/goal"),
        milestones: z
          .array(z.string())
          .min(2)
          .max(4)
          .describe("Specific actionable milestones"),
      }),
    )
    .min(3)
    .max(4)
    .describe("Implementation roadmap phases"),
  roi: z
    .array(
      z.object({
        metric: z.string().describe("What's being measured"),
        projection: z.string().describe("Expected improvement with numbers"),
      }),
    )
    .min(3)
    .max(5)
    .describe("Estimated ROI projections with specific numbers"),
  summary: z
    .string()
    .describe(
      "2-3 sentence executive summary of the report findings and top recommendation",
    ),
});

export type ReportOutput = z.infer<typeof ReportSchema>;
export type ScoreItem = z.infer<typeof ScoreItemSchema>;

// ─── Answer Quality Assessment ────────────────────────────────────────────────

export const AnswerQualitySchema = z.object({
  quality: z
    .enum(["rich", "adequate", "vague"])
    .describe(
      "rich = detailed answer with specifics (tool names, numbers, processes). adequate = useful but could be deeper. vague = too short, generic, or unclear to draw conclusions from.",
    ),
  followUp: z
    .string()
    .nullable()
    .describe(
      "If quality is 'vague', a specific follow-up probe question to get more detail. Must reference what was vague about their answer. Null if quality is rich/adequate.",
    ),
  extractedSignals: z
    .array(z.string())
    .describe(
      "Key signals/facts extracted from this answer that can inform scoring. E.g., 'uses 5+ disconnected tools', 'no CRM system', 'manual invoice processing'.",
    ),
});

export type AnswerQualityOutput = z.infer<typeof AnswerQualitySchema>;

// ─── Progressive Score Update ─────────────────────────────────────────────────

export const PartialScoreSchema = z.object({
  scores: z
    .object({
      toolChaos: z
        .number()
        .min(0)
        .max(100)
        .nullable()
        .describe(
          "Current estimated score based on evidence so far, or null if insufficient data",
        ),
      leadLeakage: z
        .number()
        .min(0)
        .max(100)
        .nullable()
        .describe(
          "Current estimated score based on evidence so far, or null if insufficient data",
        ),
      processFragmentation: z
        .number()
        .min(0)
        .max(100)
        .nullable()
        .describe(
          "Current estimated score based on evidence so far, or null if insufficient data",
        ),
      communicationOverload: z
        .number()
        .min(0)
        .max(100)
        .nullable()
        .describe(
          "Current estimated score based on evidence so far, or null if insufficient data",
        ),
      dataDisconnection: z
        .number()
        .min(0)
        .max(100)
        .nullable()
        .describe(
          "Current estimated score based on evidence so far, or null if insufficient data",
        ),
    })
    .describe(
      "Current partial scores. Null means not enough evidence yet for that dimension.",
    ),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Overall confidence level (0-100) in the current partial scores based on evidence quality and quantity",
    ),
});

export type PartialScoreOutput = z.infer<typeof PartialScoreSchema>;

// ─── Dynamic Question Routing ─────────────────────────────────────────────────

export const QuestionRoutingSchema = z.object({
  skipTopics: z
    .array(z.string())
    .describe(
      "Topic names to SKIP because the crawl data already provides strong evidence. E.g., if the website clearly shows they use Salesforce + HubSpot + 3 other disconnected tools, skip asking about tool chaos.",
    ),
  priorityTopics: z
    .array(z.string())
    .describe(
      "Topics to ask FIRST because the crawl data reveals clear gaps. Order by information value — ask about things we can't determine from the website.",
    ),
  reasoning: z
    .string()
    .describe("Brief explanation of why these topics were prioritized/skipped"),
});

export type QuestionRoutingOutput = z.infer<typeof QuestionRoutingSchema>;
