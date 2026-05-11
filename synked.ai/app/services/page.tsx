import type { Metadata } from "next";
import { ServicesPage } from "./ServicesPage";

export const metadata: Metadata = {
  title: "Services — Synked.ai",
  description:
    "Full-stack AI systems designed, deployed, and managed for real-world results. AI Agents, RAG Systems, Workflow Automation, and Managed AI Ops.",
};

export default function Page() {
  return <ServicesPage />;
}
