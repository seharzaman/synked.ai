import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";

export async function GET(req: NextRequest) {
  try {
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

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { contactName: { contains: search, mode: "insensitive" } },
        { contactEmail: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status && ["in_progress", "completed", "expired"].includes(status)) {
      where.status = status;
    }

    const [audits, total] = await Promise.all([
      prisma.auditReport.findMany({
        where,
        include: {
          company: { select: { id: true, name: true } },
          client: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditReport.count({ where }),
    ]);

    return NextResponse.json({ audits, total, page, limit });
  } catch (error) {
    console.error("[admin/audits] GET error:", error);
    return NextResponse.json(
      { error: "Internal server error", audits: [], total: 0 },
      { status: 500 },
    );
  }
}
