import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import { projectUpdateSchema } from "@/lib/validations/project";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      company: { select: { id: true, name: true } },
      client: { select: { id: true, name: true, email: true } },
      audit: {
        select: {
          id: true,
          overallScore: true,
          summary: true,
          completedAt: true,
        },
      },
      deliverables: {
        include: {
          blueprint: { select: { id: true, name: true } },
          agent: { select: { id: true, name: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      agents: { select: { id: true, name: true, type: true, status: true } },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const body = await req.json();
  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.industry !== undefined) updateData.industry = data.industry;
  if (data.startDate !== undefined)
    updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  if (data.endDate !== undefined)
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  if (data.budget !== undefined) updateData.budget = data.budget;
  if (data.companyId !== undefined)
    updateData.companyId = data.companyId || null;
  if (data.clientId !== undefined) updateData.clientId = data.clientId || null;

  const project = await prisma.project.update({
    where: { id },
    data: updateData,
  });

  await logActivity("updated", "project", project.id, auth.session!.user.id, {
    fields: Object.keys(updateData),
  });

  return NextResponse.json(project);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  await prisma.project.delete({ where: { id } });

  await logActivity("deleted", "project", id, auth.session!.user.id);

  return NextResponse.json({ success: true });
}
