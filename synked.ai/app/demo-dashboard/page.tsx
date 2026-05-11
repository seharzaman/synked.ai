import type { Metadata } from "next";
import { DemoDashboardPage } from "./DemoDashboardPage";

export const metadata: Metadata = {
  title: "Agent Dashboard — Synked.ai",
  description:
    "Monitor and manage your AI agents in real-time. View performance metrics, diagnose issues, and optimize your AI systems.",
};

export default function Page() {
  return <DemoDashboardPage />;
}
