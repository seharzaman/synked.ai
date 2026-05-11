export interface ScoreItem {
  score: number;
  rationale: string;
}

export interface AuditScores {
  toolChaos: ScoreItem;
  leadLeakage: ScoreItem;
  processFragmentation: ScoreItem;
  communicationOverload: ScoreItem;
  dataDisconnection: ScoreItem;
}

export interface ReportData {
  scores: AuditScores;
  overallScore: number;
  scoreRationale: string;
  opportunities: {
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    timeframe: string;
  }[];
  recommendedStack: {
    tool: string;
    purpose: string;
  }[];
  roadmap: {
    phase: string;
    title: string;
    milestones: string[];
  }[];
  roi: {
    metric: string;
    projection: string;
  }[];
  summary: string;
}

export const SCORE_LABELS: Record<keyof AuditScores, string> = {
  toolChaos: "Tool Chaos",
  leadLeakage: "Lead Leakage",
  processFragmentation: "Process Fragmentation",
  communicationOverload: "Communication Overload",
  dataDisconnection: "Data Disconnection",
};
