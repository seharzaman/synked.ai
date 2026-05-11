import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserAPI } from "@/lib/require-user";
import { logActivity } from "@/lib/activity-log";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireUserAPI();
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const userId = auth.session.user.id;
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") ?? 20)),
    );

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          config: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { agents: true } },
        },
      }),
      prisma.project.count({ where: { userId } }),
    ]);

    return NextResponse.json({ projects, total, page, limit });
  } catch (error) {
    console.error("[user/projects] GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserAPI();
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const userId = auth.session.user.id;
    const body = await req.json();

    const { name, description, config } = body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        config: (config ?? null) as Prisma.InputJsonValue | null,
        status: "discovery",
        userId,
      },
    });

    await logActivity("project.created", "project", project.id, userId, {
      name: project.name,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("[user/projects] POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
