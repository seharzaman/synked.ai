export interface BuilderComponent {
  type: string;
  icon: string;
  label: string;
  color: string;
  cost: number;
  latency: number;
  desc: string;
}

export const builderComponents: BuilderComponent[] = [
  {
    type: "llm",
    icon: "Cpu",
    label: "LLM Core",
    color: "#125842",
    cost: 0.003,
    latency: 320,
    desc: "Language model node",
  },
  {
    type: "rag",
    icon: "BookOpen",
    label: "RAG System",
    color: "#7F8C43",
    cost: 0.001,
    latency: 180,
    desc: "Knowledge retrieval",
  },
  {
    type: "api",
    icon: "Plug",
    label: "API Layer",
    color: "#B089AA",
    cost: 0.0005,
    latency: 90,
    desc: "External integrations",
  },
  {
    type: "cache",
    icon: "Database",
    label: "Cache",
    color: "#6B8FA8",
    cost: 0.0001,
    latency: 5,
    desc: "Fast response store",
  },
  {
    type: "queue",
    icon: "Inbox",
    label: "Queue",
    color: "#A86B3A",
    cost: 0.0002,
    latency: 15,
    desc: "Async job handling",
  },
  {
    type: "embed",
    icon: "Search",
    label: "Embeddings",
    color: "#3A6B8F",
    cost: 0.0008,
    latency: 120,
    desc: "Vector search",
  },
];
