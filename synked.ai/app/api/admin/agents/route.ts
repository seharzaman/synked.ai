import type { Prisma } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import { agentCreateSchema } from "@/lib/validations/agent";

export async function GET(req: NextRequest) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") ?? 20)),
  );
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const type = searchParams.get("type") ?? "";
  const companyId = searchParams.get("companyId") ?? "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status && ["ok", "degraded", "failing", "offline"].includes(status)) {
    where.status = status;
  }
  if (type) {
    where.type = type;
  }
  if (companyId) {
    where.companyId = companyId;
  }

  const [agents, total] = await Promise.all([
    prisma.aIAgent.findMany({
      where,
      include: {
        company: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } },
        metrics: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.aIAgent.count({ where }),
  ]);

  return NextResponse.json({ agents, total, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const parsed = agentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const agent = await prisma.aIAgent.create({
    data: {
      name: data.name,
      type: data.type,
      status: data.status,
      description: data.description ?? null,
      config: (data.config ?? undefined) as Prisma.InputJsonValue | undefined,
      companyId: data.companyId ?? null,
      clientId: data.clientId ?? null,
    },
  });

  await logActivity("created", "agent", agent.id, auth.session!.user.id, {
    name: agent.name,
    type: agent.type,
  });

  return NextResponse.json(agent, { status: 201 });
}
