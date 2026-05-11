import type { Prisma } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import { agentUpdateSchema } from "@/lib/validations/agent";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const agent = await prisma.aIAgent.findUnique({
    where: { id },
    include: {
      company: { select: { id: true, name: true } },
      client: { select: { id: true, name: true } },
      metrics: {
        orderBy: { recordedAt: "desc" },
        take: 50,
      },
    },
  });

  if (!agent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(agent);
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
  const parsed = agentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await prisma.aIAgent.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { companyId, clientId, config, ...rest } = parsed.data;
  const agent = await prisma.aIAgent.update({
    where: { id },
    data: {
      ...rest,
      ...(companyId !== undefined && {
        company: companyId
          ? { connect: { id: companyId } }
          : { disconnect: true },
      }),
      ...(clientId !== undefined && {
        client: clientId ? { connect: { id: clientId } } : { disconnect: true },
      }),
      ...(config !== undefined && {
        config: (config ?? undefined) as Prisma.InputJsonValue | undefined,
      }),
    },
  });

  await logActivity("updated", "agent", agent.id, auth.session!.user.id, {
    changes: Object.keys(parsed.data),
  });

  return NextResponse.json(agent);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const existing = await prisma.aIAgent.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.aIAgent.delete({ where: { id } });

  await logActivity("deleted", "agent", id, auth.session!.user.id, {
    name: existing.name,
  });

  return NextResponse.json({ success: true });
}
