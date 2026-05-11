"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FolderOpen,
  Activity,
  Bot,
  ClipboardCheck,
  Plus,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  Clock,
  ExternalLink,
  LogOut,
} from "lucide-react";

interface DashboardData {
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalAgents: number;
    agentsByStatus: Record<string, number>;
    completedAudits: number;
  };
  projects: Array<{
    id: string;
    name: string;
    description: string | null;
    config: unknown;
    status: string;
    updatedAt: string;
    createdAt: string;
    _count: { agents: number; deliverables: number };
  }>;
  agents: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    updatedAt: string;
    metrics: Array<{
      latency: number;
      successRate: number;
      errorCount: number;
      uptime: number;
      rpm: number;
      recordedAt: string;
    }>;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    details: Record<string, unknown> | null;
    createdAt: string;
  }>;
  audits: Array<{
    id: string;
    contactName: string;
    overallScore: number;
    status: string;
    summary: string;
    createdAt: string;
    completedAt: string | null;
  }>;
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    action: string;
    href: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  ok: "bg-emerald-500",
  degraded: "bg-amber-500",
  failing: "bg-red-500",
  offline: "bg-zinc-400",
  discovery: "bg-blue-500",
  active: "bg-emerald-500",
  delivered: "bg-purple-500",
  paused: "bg-zinc-400",
};

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function formatAction(action: string) {
  return action
    .replace(/\./g, " ")
    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/user/dashboard");
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      // Silent fail — show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchDashboard();
  }, [session, fetchDashboard]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
          <p className="text-sm text-espresso/40 font-mono">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  const stats = data?.stats;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-espresso">
            Welcome back, {session.user.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-espresso/50 mt-0.5">
            Here&apos;s what&apos;s happening with your AI systems
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="bg-emerald text-white hover:bg-emerald-lt"
          >
            <Link href="/demo-builder">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Design
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-espresso/50"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        <KPICard
          icon={<FolderOpen className="h-4 w-4" />}
          label="Projects"
          value={stats?.totalProjects ?? 0}
          sub={`${stats?.activeProjects ?? 0} active`}
        />
        <KPICard
          icon={<Bot className="h-4 w-4" />}
          label="AI Agents"
          value={stats?.totalAgents ?? 0}
          sub={`${stats?.agentsByStatus?.ok ?? 0} online`}
          alert={
            (stats?.agentsByStatus?.degraded ?? 0) +
              (stats?.agentsByStatus?.failing ?? 0) >
            0
          }
        />
        <KPICard
          icon={<ClipboardCheck className="h-4 w-4" />}
          label="Audits"
          value={data?.audits?.length ?? 0}
          sub={`${stats?.completedAudits ?? 0} completed`}
        />
        <KPICard
          icon={<Activity className="h-4 w-4" />}
          label="Activity"
          value={data?.recentActivity?.length ?? 0}
          sub="recent actions"
        />
      </div>

      {/* Recommendations */}
      {data?.recommendations && data.recommendations.length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-700">
              Recommendations
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.recommendations.map((rec, i) => (
              <Link
                key={i}
                href={rec.href}
                className="group rounded-lg border border-amber-200/50 bg-white p-3 transition-all hover:border-emerald/30 hover:shadow-sm"
              >
                <p className="text-sm font-medium text-espresso mb-1">
                  {rec.title}
                </p>
                <p className="text-xs text-espresso/50 mb-2 line-clamp-2">
                  {rec.description}
                </p>
                <span className="text-xs font-medium text-emerald group-hover:underline">
                  {rec.action} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Projects + Agents */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Projects */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-mono uppercase tracking-wider text-espresso/40">
                My Designs
              </h2>
              <Link
                href="/demo-builder"
                className="text-xs text-emerald hover:underline flex items-center gap-1"
              >
                Open Builder <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            {data?.projects && data.projects.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/demo-builder?project=${project.id}`}
                    className="group rounded-xl border border-bone bg-white p-4 transition-all hover:border-emerald/30 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-espresso group-hover:text-emerald transition-colors truncate">
                        {project.name}
                      </h3>
                      <span
                        className={`h-2 w-2 rounded-full mt-1.5 ${STATUS_COLORS[project.status] ?? "bg-zinc-300"}`}
                      />
                    </div>
                    {project.description && (
                      <p className="text-xs text-espresso/50 line-clamp-1 mb-2">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-espresso/40 font-mono">
                      <span>{project._count.agents} agents</span>
                      <span>·</span>
                      <span>{formatRelativeTime(project.updatedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-bone p-8 text-center">
                <FolderOpen className="h-8 w-8 text-espresso/20 mx-auto mb-2" />
                <p className="text-sm text-espresso/40 mb-3">
                  No designs saved yet
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/demo-builder">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Create First Design
                  </Link>
                </Button>
              </div>
            )}
          </section>

          {/* Agents */}
          <section>
            <h2 className="text-sm font-mono uppercase tracking-wider text-espresso/40 mb-3">
              AI Agents
            </h2>
            {data?.agents && data.agents.length > 0 ? (
              <div className="space-y-2">
                {data.agents.map((agent) => {
                  const metric = agent.metrics[0];
                  return (
                    <div
                      key={agent.id}
                      className="rounded-xl border border-bone bg-white p-4 flex items-center gap-4"
                    >
                      <div
                        className={`h-3 w-3 rounded-full ${STATUS_COLORS[agent.status] ?? "bg-zinc-300"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-espresso truncate">
                          {agent.name}
                        </p>
                        <p className="text-xs text-espresso/40">{agent.type}</p>
                      </div>
                      {metric && (
                        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-espresso/50">
                          <span>{metric.latency}ms</span>
                          <span>{metric.successRate}%</span>
                          <span>{metric.uptime}% up</span>
                        </div>
                      )}
                      {(agent.status === "degraded" ||
                        agent.status === "failing") && (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-bone p-6 text-center">
                <Bot className="h-8 w-8 text-espresso/20 mx-auto mb-2" />
                <p className="text-sm text-espresso/40">
                  No agents deployed yet. Create a design first.
                </p>
              </div>
            )}
          </section>

          {/* Audits */}
          {data?.audits && data.audits.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-mono uppercase tracking-wider text-espresso/40">
                  Business Audits
                </h2>
                <Link
                  href="/business-audit"
                  className="text-xs text-emerald hover:underline flex items-center gap-1"
                >
                  New Audit <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {data.audits.map((audit) => (
                  <Link
                    key={audit.id}
                    href={`/business-audit/report?id=${audit.id}`}
                    className="block rounded-xl border border-bone bg-white p-4 hover:border-emerald/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-espresso">
                        {audit.contactName}
                      </p>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                          audit.status === "completed"
                            ? "bg-emerald/10 text-emerald"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {audit.status === "completed"
                          ? `Score: ${audit.overallScore}`
                          : "In Progress"}
                      </span>
                    </div>
                    <p className="text-xs text-espresso/50 line-clamp-1">
                      {audit.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <section className="rounded-xl border border-bone bg-white p-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-espresso/40 mb-3">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/demo-builder"
                className="flex items-center gap-3 rounded-lg p-2.5 text-sm text-espresso hover:bg-emerald/5 transition-colors"
              >
                <Plus className="h-4 w-4 text-emerald" />
                New Architecture Design
              </Link>
              <Link
                href="/business-audit"
                className="flex items-center gap-3 rounded-lg p-2.5 text-sm text-espresso hover:bg-emerald/5 transition-colors"
              >
                <ClipboardCheck className="h-4 w-4 text-emerald" />
                Run Business Audit
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-lg p-2.5 text-sm text-espresso hover:bg-emerald/5 transition-colors"
              >
                <Activity className="h-4 w-4 text-emerald" />
                Get in Touch
              </Link>
            </div>
          </section>

          {/* Activity Timeline */}
          <section className="rounded-xl border border-bone bg-white p-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-espresso/40 mb-3">
              Recent Activity
            </h2>
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-emerald/50 mt-1.5" />
                      <div className="flex-1 w-px bg-bone mt-1" />
                    </div>
                    <div className="pb-3">
                      <p className="text-xs text-espresso leading-snug">
                        {formatAction(activity.action)}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="h-3 w-3 text-espresso/30" />
                        <span className="text-[10px] text-espresso/40 font-mono">
                          {formatRelativeTime(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-espresso/40 text-center py-4">
                No recent activity
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  sub,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-xl border border-bone bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-emerald">{icon}</span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-espresso/40">
          {label}
        </span>
        {alert && <AlertTriangle className="h-3 w-3 text-amber-500 ml-auto" />}
      </div>
      <p className="text-2xl font-serif font-bold text-espresso">{value}</p>
      <p className="text-[10px] text-espresso/40 font-mono mt-0.5">{sub}</p>
    </div>
  );
}
