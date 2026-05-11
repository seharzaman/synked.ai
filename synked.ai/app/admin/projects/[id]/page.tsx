"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

interface ProjectDetail {
  id: string;
  name: string;
  description: string | null;
  status: "discovery" | "active" | "delivered" | "paused";
  industry: string | null;
  budget: number | null;
  startDate: string | null;
  endDate: string | null;
  company: { id: string; name: string } | null;
  client: { id: string; name: string } | null;
  audit: { id: string; contactName: string; overallScore: number } | null;
  deliverables: {
    id: string;
    name: string;
    type: string;
    completedAt: string | null;
  }[];
  agents: {
    id: string;
    name: string;
    status: "ok" | "degraded" | "failing" | "offline";
  }[];
  createdAt: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="p-8 text-muted-foreground">Loading...</div>;
  if (!project)
    return <div className="p-8 text-muted-foreground">Project not found</div>;

  return (
    <div>
      <PageHeader
        title={project.name}
        description={project.description ?? undefined}
        actions={
          <Button
            variant="outline"
            onClick={() => router.push("/admin/projects")}
          >
            <ArrowLeft className="size-4 mr-1" /> Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase">Status</p>
          <StatusBadge status={project.status} />
        </div>
        <div className="border rounded-lg p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase">Budget</p>
          <p className="font-medium">
            {project.budget ? `$${project.budget.toLocaleString()}` : "—"}
          </p>
        </div>
        <div className="border rounded-lg p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase">Company</p>
          <p className="font-medium">{project.company?.name ?? "—"}</p>
        </div>
      </div>

      {/* Deliverables */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3">
          Deliverables ({project.deliverables.length})
        </h3>
        {project.deliverables.length === 0 ? (
          <p className="text-muted-foreground text-sm">No deliverables yet</p>
        ) : (
          <div className="space-y-2">
            {project.deliverables.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.type}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {d.completedAt ? "Done" : "In progress"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agents */}
      {project.agents.length > 0 && (
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">
            Assigned Agents ({project.agents.length})
          </h3>
          <div className="space-y-2">
            {project.agents.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between py-2"
              >
                <span className="font-medium">{a.name}</span>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source audit */}
      {project.audit && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Source Audit</h3>
          <p className="text-sm">
            {project.audit.contactName} — Score: {project.audit.overallScore}
            /100
          </p>
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => router.push(`/admin/audits/${project.audit!.id}`)}
          >
            View Audit
          </Button>
        </div>
      )}
    </div>
  );
}
