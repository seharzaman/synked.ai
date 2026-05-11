import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import { clientCreateSchema } from "@/lib/validations/client";

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
      { email: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status && ["active", "inactive", "lead"].includes(status)) {
    where.status = status;
  }
  if (companyId) {
    where.companyId = companyId;
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      include: {
        company: { select: { id: true, name: true } },
        _count: { select: { agents: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.client.count({ where }),
  ]);

  return NextResponse.json({ clients, total, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const parsed = clientCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const client = await prisma.client.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      title: data.title ?? null,
      status: data.status,
      notes: data.notes ?? null,
      companyId: data.companyId ?? null,
    },
  });

  await logActivity("created", "client", client.id, auth.session!.user.id, {
    name: client.name,
  });

  return NextResponse.json(client, { status: 201 });
}
