import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import { agentTemplateUpdateSchema } from "@/lib/validations/agent-template";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const template = await prisma.agentTemplate.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true } },
      agents: {
        select: {
          id: true,
          name: true,
          status: true,
          company: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json(template);
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
  const parsed = agentTemplateUpdateSchema.safeParse(body);
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
  if (data.type !== undefined) updateData.type = data.type;
  if (data.graphPattern !== undefined)
    updateData.graphPattern = data.graphPattern;
  if (data.baseConfig !== undefined)
    updateData.baseConfig = data.baseConfig as Prisma.InputJsonValue;
  if (data.systemPrompt !== undefined)
    updateData.systemPrompt = data.systemPrompt;
  if (data.teamConfig !== undefined)
    updateData.teamConfig = data.teamConfig as unknown as Prisma.InputJsonValue;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.tags !== undefined) updateData.tags = data.tags;

  const template = await prisma.agentTemplate.update({
    where: { id },
    data: updateData,
  });

  await logActivity(
    "updated",
    "agent_template",
    template.id,
    auth.session!.user.id,
    {
      fields: Object.keys(updateData),
    },
  );

  return NextResponse.json(template);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  await prisma.agentTemplate.delete({ where: { id } });

  await logActivity("deleted", "agent_template", id, auth.session!.user.id);

  return NextResponse.json({ success: true });
}
