import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import {
  insightCreateSchema,
  insightUpdateSchema,
} from "@/lib/validations/insight";

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
  const industry = searchParams.get("industry") ?? "";
  const category = searchParams.get("category") ?? "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.finding = { contains: search, mode: "insensitive" };
  }
  if (industry) {
    where.industry = { contains: industry, mode: "insensitive" };
  }
  if (category) {
    where.category = { contains: category, mode: "insensitive" };
  }

  const [insights, total] = await Promise.all([
    prisma.insight.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { evidenceCount: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.insight.count({ where }),
  ]);

  return NextResponse.json({ insights, total, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const parsed = insightCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const insight = await prisma.insight.create({
    data: {
      industry: data.industry,
      category: data.category,
      finding: data.finding,
      evidenceCount: data.evidenceCount,
      avgROI: data.avgROI ?? null,
      relatedBlueprintIds: data.relatedBlueprintIds ?? [],
      tags: data.tags ?? [],
      createdById: auth.session!.user.id,
    },
  });

  await logActivity("created", "insight", insight.id, auth.session!.user.id, {
    industry: insight.industry,
    category: insight.category,
  });

  return NextResponse.json(insight, { status: 201 });
}
