import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import { blueprintCreateSchema } from "@/lib/validations/blueprint";
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
  const industry = searchParams.get("industry") ?? "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (
    category &&
    ["agent", "workflow", "rag", "full_system"].includes(category)
  ) {
    where.category = category;
  }
  if (industry) {
    where.industry = { contains: industry, mode: "insensitive" };
  }

  const [blueprints, total] = await Promise.all([
    prisma.blueprint.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true } },
        _count: { select: { deliverables: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blueprint.count({ where }),
  ]);

  return NextResponse.json({ blueprints, total, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const parsed = blueprintCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Check slug uniqueness
  const existing = await prisma.blueprint.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const blueprint = await prisma.blueprint.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      industry: data.industry ?? null,
      category: data.category,
      steps: data.steps as unknown as Prisma.InputJsonValue,
      estimatedHours: data.estimatedHours ?? null,
      estimatedROI: data.estimatedROI ?? null,
      tags: data.tags ?? [],
      createdById: auth.session!.user.id,
    },
  });

  await logActivity(
    "created",
    "blueprint",
    blueprint.id,
    auth.session!.user.id,
    {
      name: blueprint.name,
    },
  );

  return NextResponse.json(blueprint, { status: 201 });
}
