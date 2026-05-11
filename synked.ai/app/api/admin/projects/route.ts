import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import { projectCreateSchema } from "@/lib/validations/project";

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
  const companyId = searchParams.get("companyId") ?? "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (
    status &&
    ["discovery", "active", "delivered", "paused"].includes(status)
  ) {
    where.status = status;
  }
  if (companyId) {
    where.companyId = companyId;
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        company: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } },
        _count: { select: { deliverables: true, agents: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.project.count({ where }),
  ]);

  return NextResponse.json({ projects, total, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const parsed = projectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      status: data.status,
      industry: data.industry ?? null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      budget: data.budget ?? null,
      companyId: data.companyId ?? null,
      clientId: data.clientId ?? null,
      auditId: data.auditId ?? null,
    },
  });

  await logActivity("created", "project", project.id, auth.session!.user.id, {
    name: project.name,
  });

  return NextResponse.json(project, { status: 201 });
}
