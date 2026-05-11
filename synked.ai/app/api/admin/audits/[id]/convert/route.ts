import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const audit = await prisma.auditReport.findUnique({ where: { id } });

  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  if (audit.status !== "completed") {
    return NextResponse.json(
      { error: "Only completed audits can be converted to projects" },
      { status: 400 },
    );
  }

  // Create a project from the audit
  const project = await prisma.project.create({
    data: {
      name: `${audit.contactName} — AI Implementation`,
      description: audit.summary,
      status: "discovery",
      industry: undefined,
      companyId: audit.companyId,
      clientId: audit.clientId,
      auditId: audit.id,
    },
  });

  await logActivity("created", "project", project.id, auth.session!.user.id, {
    name: project.name,
    fromAudit: audit.id,
  });

  return NextResponse.json(project, { status: 201 });
}
