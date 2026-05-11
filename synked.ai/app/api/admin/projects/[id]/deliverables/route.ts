import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import {
  deliverableCreateSchema,
  deliverableUpdateSchema,
} from "@/lib/validations/deliverable";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const deliverables = await prisma.projectDeliverable.findMany({
    where: { projectId: id },
    include: {
      blueprint: { select: { id: true, name: true } },
      agent: { select: { id: true, name: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(deliverables);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const body = await req.json();
  const parsed = deliverableCreateSchema.safeParse({ ...body, projectId: id });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const deliverable = await prisma.projectDeliverable.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      type: data.type,
      config: (data.config as Prisma.InputJsonValue) ?? undefined,
      outcome: (data.outcome as Prisma.InputJsonValue) ?? undefined,
      notes: data.notes ?? null,
      projectId: id,
      blueprintId: data.blueprintId ?? null,
      agentId: data.agentId ?? null,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
    },
  });

  // Increment blueprint usage count if one was used
  if (data.blueprintId) {
    await prisma.blueprint.update({
      where: { id: data.blueprintId },
      data: { usageCount: { increment: 1 } },
    });
  }

  await logActivity(
    "created",
    "deliverable",
    deliverable.id,
    auth.session!.user.id,
    {
      name: deliverable.name,
      projectId: id,
    },
  );

  return NextResponse.json(deliverable, { status: 201 });
}
