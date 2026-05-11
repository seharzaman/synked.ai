import Link from "next/link";
import {
  Buildings,
  Users,
  Robot,
  Warning,
  Plus,
  ArrowRight,
  Clock,
  Briefcase,
  ClipboardText,
  Blueprint,
} from "@phosphor-icons/react/dist/ssr";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/admin/StatsCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminOverviewPage() {
  const [
    totalCompanies,
    totalClients,
    totalAgents,
    agentsByStatus,
    activeProjects,
    recentAudits,
    topBlueprints,
    recentCompanies,
    recentClients,
    recentActivity,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.client.count(),
    prisma.aIAgent.count(),
    prisma.aIAgent.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.project.count({ where: { status: "active" } }),
    prisma.auditReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        contactName: true,
        overallScore: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.blueprint.findMany({
      orderBy: { usageCount: "desc" },
      take: 5,
      select: { id: true, name: true, category: true, usageCount: true },
    }),
    prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, status: true, createdAt: true },
    }),
    prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const statusMap = Object.fromEntries(
    agentsByStatus.map((s) => [s.status, s._count]),
  );
  const issueAgents =
    (statusMap["degraded"] ?? 0) + (statusMap["failing"] ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Admin dashboard overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <StatsCard
          title="Active Projects"
          value={activeProjects}
          icon={<Briefcase className="size-5" />}
        />
        <StatsCard
          title="Companies"
          value={totalCompanies}
          icon={<Buildings className="size-5" />}
        />
        <StatsCard
          title="Clients"
          value={totalClients}
          icon={<Users className="size-5" />}
        />
        <StatsCard
          title="AI Agents"
          value={totalAgents}
          description={`${statusMap["ok"] ?? 0} healthy`}
          icon={<Robot className="size-5" />}
        />
        <StatsCard
          title="Agents with Issues"
          value={issueAgents}
          description={issueAgents > 0 ? "Needs attention" : "All clear"}
          icon={<Warning className="size-5" />}
        />
        <StatsCard
          title="Audits"
          value={recentAudits.length}
          description="Recent"
          icon={<ClipboardText className="size-5" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href="/admin/companies/new">
            <Plus className="size-4 mr-1" /> Add Company
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/clients/new">
            <Plus className="size-4 mr-1" /> Add Client
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/agents/new">
            <Plus className="size-4 mr-1" /> Add Agent
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Companies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Companies</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/companies">
                View all <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentCompanies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No companies yet</p>
            ) : (
              <div className="space-y-3">
                {recentCompanies.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/companies/${c.id}`}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-sm">{c.name}</span>
                    <StatusBadge status={c.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Clients</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/clients">
                View all <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No clients yet</p>
            ) : (
              <div className="space-y-3">
                {recentClients.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/clients/${c.id}`}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-muted transition-colors"
                  >
                    <div>
                      <span className="font-medium text-sm">{c.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {c.email}
                      </span>
                    </div>
                    <StatusBadge status={c.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agent Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Agent Health</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/agents">
                View all <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {totalAgents === 0 ? (
              <p className="text-sm text-muted-foreground">No agents yet</p>
            ) : (
              <div className="space-y-3">
                {(["ok", "degraded", "failing", "offline"] as const).map(
                  (status) => (
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <StatusBadge status={status} />
                      <span className="text-sm font-medium">
                        {statusMap[status] ?? 0}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <Clock className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p>
                        <span className="font-medium">
                          {log.user?.name ?? "System"}
                        </span>{" "}
                        {log.action}{" "}
                        <span className="text-muted-foreground">
                          {log.entityType}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Audits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Audits</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/audits">
                View all <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentAudits.length === 0 ? (
              <p className="text-sm text-muted-foreground">No audits yet</p>
            ) : (
              <div className="space-y-3">
                {recentAudits.map((a) => (
                  <Link
                    key={a.id}
                    href={`/admin/audits/${a.id}`}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-muted transition-colors"
                  >
                    <div>
                      <span className="font-medium text-sm">
                        {a.contactName}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        Score: {a.overallScore}
                      </span>
                    </div>
                    <StatusBadge status={a.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Blueprints */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Top Blueprints</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/blueprints">
                View all <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {topBlueprints.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blueprints yet</p>
            ) : (
              <div className="space-y-3">
                {topBlueprints.map((bp) => (
                  <Link
                    key={bp.id}
                    href={`/admin/blueprints/${bp.id}`}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Blueprint className="size-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{bp.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {bp.usageCount}x used
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
