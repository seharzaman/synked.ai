"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toast } from "sonner";
import type { AuditScores, ReportData } from "@/app/business-audit/types";
import { SCORE_LABELS } from "@/app/business-audit/types";

interface AuditDetail {
  id: string;
  threadId: string | null;
  contactName: string;
  contactEmail: string;
  contactRole: string | null;
  websiteUrl: string | null;
  scores: AuditScores;
  overallScore: number;
  opportunities: ReportData["opportunities"];
  recommendedStack: ReportData["recommendedStack"];
  roadmap: ReportData["roadmap"];
  roi: ReportData["roi"];
  summary: string;
  selectedDepartments: string[];
  status: "in_progress" | "completed" | "expired";
  companyId: string | null;
  company: { id: string; name: string } | null;
  client: { id: string; name: string } | null;
  projects: {
    id: string;
    name: string;
    status: "discovery" | "active" | "delivered" | "paused";
  }[];
  createdAt: string;
  completedAt: string | null;
}

export default function AuditDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [audit, setAudit] = useState<AuditDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/audits/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setAudit(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleConvert() {
    setConverting(true);
    const res = await fetch(`/api/admin/audits/${id}/convert`, {
      method: "POST",
    });
    if (res.ok) {
      const project = await res.json();
      toast.success("Project created from audit");
      router.push(`/admin/projects/${project.id}`);
    } else {
      toast.error("Failed to convert audit");
    }
    setConverting(false);
  }

  if (loading)
    return <div className="p-8 text-muted-foreground">Loading...</div>;
  if (!audit)
    return <div className="p-8 text-muted-foreground">Audit not found</div>;

  return (
    <div>
      <PageHeader
        title={`Audit — ${audit.contactName}`}
        description={audit.summary}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/audits")}
            >
              <ArrowLeft className="size-4 mr-1" /> Back
            </Button>
            {audit.status === "completed" && audit.projects.length === 0 && (
              <Button onClick={handleConvert} disabled={converting}>
                <ArrowRight className="size-4 mr-1" /> Convert to Project
              </Button>
            )}
          </div>
        }
      />

      {/* Score cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Overall
          </p>
          <p className="text-3xl font-mono font-bold">{audit.overallScore}</p>
        </div>
        {audit.scores &&
          Object.entries(audit.scores).map(([key, val]) => (
            <div key={key} className="border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {SCORE_LABELS[key as keyof AuditScores] ?? key}
              </p>
              <p className="text-2xl font-mono font-bold">{val.score}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {val.rationale}
              </p>
            </div>
          ))}
      </div>

      {/* Meta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4 space-y-2">
          <h3 className="font-semibold">Contact</h3>
          <p>
            {audit.contactName} ({audit.contactRole})
          </p>
          <p className="text-sm text-muted-foreground">{audit.contactEmail}</p>
          {audit.websiteUrl && (
            <p className="text-sm text-muted-foreground">{audit.websiteUrl}</p>
          )}
        </div>
        <div className="border rounded-lg p-4 space-y-2">
          <h3 className="font-semibold">Details</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <StatusBadge status={audit.status} />
          </div>
          {audit.company && (
            <p className="text-sm">Company: {audit.company.name}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Departments: {audit.selectedDepartments.join(", ")}
          </p>
          <p className="text-sm text-muted-foreground">
            Completed:{" "}
            {audit.completedAt
              ? new Date(audit.completedAt).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      {/* Opportunities */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3">Top Opportunities</h3>
        <div className="space-y-3">
          {audit.opportunities?.map((opp, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{opp.title}</p>
                <p className="text-sm text-muted-foreground">
                  {opp.description}
                </p>
                <div className="flex gap-2 mt-1">
                  <StatusBadge status={opp.impact} />
                  <span className="text-xs text-muted-foreground">
                    {opp.timeframe}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects from this audit */}
      {audit.projects.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Related Projects</h3>
          {audit.projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2">
              <span className="font-medium">{p.name}</span>
              <div className="flex items-center gap-2">
                <StatusBadge status={p.status} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/projects/${p.id}`)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
