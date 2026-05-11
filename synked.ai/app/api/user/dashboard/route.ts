import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserAPI } from "@/lib/require-user";

export async function GET() {
  try {
    const auth = await requireUserAPI();
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const userId = auth.session.user.id;

    const [projects, agents, recentActivity, audits, agentCounts] =
      await Promise.all([
        prisma.project.findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          take: 6,
          select: {
            id: true,
            name: true,
            description: true,
            config: true,
            status: true,
            updatedAt: true,
            createdAt: true,
            _count: { select: { agents: true, deliverables: true } },
          },
        }),
        prisma.aIAgent.findMany({
          where: { project: { userId } },
          orderBy: { updatedAt: "desc" },
          take: 6,
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            updatedAt: true,
            metrics: {
              orderBy: { recordedAt: "desc" },
              take: 1,
              select: {
                latency: true,
                successRate: true,
                errorCount: true,
                uptime: true,
                rpm: true,
                recordedAt: true,
              },
            },
          },
        }),
        prisma.activityLog.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            action: true,
            entityType: true,
            entityId: true,
            details: true,
            createdAt: true,
          },
        }),
        prisma.auditReport.findMany({
          where: {
            OR: [
              { contactEmail: auth.session.user.email },
              { client: { email: auth.session.user.email } },
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            contactName: true,
            overallScore: true,
            status: true,
            summary: true,
            createdAt: true,
            completedAt: true,
          },
        }),
        prisma.aIAgent.groupBy({
          by: ["status"],
          where: { project: { userId } },
          _count: true,
        }),
      ]);

    const stats = {
      totalProjects: await prisma.project.count({ where: { userId } }),
      activeProjects: await prisma.project.count({
        where: { userId, status: "active" },
      }),
      totalAgents: agentCounts.reduce((sum, g) => sum + g._count, 0),
      agentsByStatus: Object.fromEntries(
        agentCounts.map((g) => [g.status, g._count]),
      ),
      completedAudits: audits.filter((a) => a.status === "completed").length,
    };

    // Generate smart recommendations
    const recommendations: Array<{
      type: string;
      title: string;
      description: string;
      action: string;
      href: string;
    }> = [];

    const inProgressAudits = audits.filter((a) => a.status === "in_progress");
    if (inProgressAudits.length > 0) {
      recommendations.push({
        type: "audit",
        title: "Complete Your Audit",
        description:
          "You have an in-progress business audit. Finish it to unlock AI recommendations.",
        action: "Continue Audit",
        href: "/business-audit",
      });
    }

    if (stats.totalAgents === 0 && projects.length > 0) {
      recommendations.push({
        type: "deploy",
        title: "Deploy Your First Agent",
        description: "You have designs saved but no agents deployed yet.",
        action: "View Projects",
        href: "/dashboard",
      });
    }

    const degradedAgents = agents.filter(
      (a) => a.status === "degraded" || a.status === "failing",
    );
    if (degradedAgents.length > 0) {
      recommendations.push({
        type: "alert",
        title: `${degradedAgents.length} Agent${degradedAgents.length > 1 ? "s" : ""} Need Attention`,
        description: `${degradedAgents.map((a) => a.name).join(", ")} ${degradedAgents.length > 1 ? "are" : "is"} showing issues.`,
        action: "View Agents",
        href: "/dashboard",
      });
    }

    if (projects.length === 0) {
      recommendations.push({
        type: "start",
        title: "Create Your First Design",
        description:
          "Use the AI Architecture Builder to design your first system.",
        action: "Open Builder",
        href: "/demo-builder",
      });
    }

    if (audits.length === 0) {
      recommendations.push({
        type: "audit",
        title: "Run a Business Audit",
        description:
          "Discover automation opportunities with our AI-powered assessment.",
        action: "Start Audit",
        href: "/business-audit",
      });
    }

    return NextResponse.json({
      stats,
      projects,
      agents,
      recentActivity,
      audits,
      recommendations,
    });
  } catch (error) {
    console.error("[user/dashboard] GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
