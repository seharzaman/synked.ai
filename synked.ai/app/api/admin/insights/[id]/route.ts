import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import { insightUpdateSchema } from "@/lib/validations/insight";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const insight = await prisma.insight.findUnique({
    where: { id },
    include: { createdBy: { select: { id: true, name: true } } },
  });

  if (!insight) {
    return NextResponse.json({ error: "Insight not found" }, { status: 404 });
  }

  return NextResponse.json(insight);
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
  const parsed = insightUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = {};

  if (data.industry !== undefined) updateData.industry = data.industry;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.finding !== undefined) updateData.finding = data.finding;
  if (data.evidenceCount !== undefined)
    updateData.evidenceCount = data.evidenceCount;
  if (data.avgROI !== undefined) updateData.avgROI = data.avgROI;
  if (data.relatedBlueprintIds !== undefined)
    updateData.relatedBlueprintIds = data.relatedBlueprintIds;
  if (data.tags !== undefined) updateData.tags = data.tags;

  const insight = await prisma.insight.update({
    where: { id },
    data: updateData,
  });

  await logActivity("updated", "insight", insight.id, auth.session!.user.id, {
    fields: Object.keys(updateData),
  });

  return NextResponse.json(insight);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  await prisma.insight.delete({ where: { id } });

  await logActivity("deleted", "insight", id, auth.session!.user.id);

  return NextResponse.json({ success: true });
}
