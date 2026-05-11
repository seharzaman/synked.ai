import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import { agentTemplateCreateSchema } from "@/lib/validations/agent-template";
import type { Prisma } from "@/generated/prisma/client";

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
  const category = searchParams.get("category") ?? "";
  const graphPattern = searchParams.get("graphPattern") ?? "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.category = category;
  }
  if (graphPattern) {
    where.graphPattern = graphPattern;
  }

  const [templates, total] = await Promise.all([
    prisma.agentTemplate.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true } },
        _count: { select: { agents: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.agentTemplate.count({ where }),
  ]);

  return NextResponse.json({ templates, total, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const parsed = agentTemplateCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const template = await prisma.agentTemplate.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      type: data.type,
      graphPattern: data.graphPattern,
      baseConfig: (data.baseConfig as Prisma.InputJsonValue) ?? undefined,
      systemPrompt: data.systemPrompt ?? null,
      teamConfig:
        (data.teamConfig as unknown as Prisma.InputJsonValue) ?? undefined,
      category: data.category ?? null,
      tags: data.tags ?? [],
      createdById: auth.session!.user.id,
    },
  });

  await logActivity(
    "created",
    "agent_template",
    template.id,
    auth.session!.user.id,
    {
      name: template.name,
    },
  );

  return NextResponse.json(template, { status: 201 });
}
