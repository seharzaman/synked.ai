import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserAPI } from "@/lib/require-user";
import { logActivity } from "@/lib/activity-log";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireUserAPI();
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const project = await prisma.project.findFirst({
      where: { id, userId: auth.session.user.id },
      include: {
        agents: {
          select: { id: true, name: true, type: true, status: true },
        },
        _count: { select: { deliverables: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("[user/projects/id] GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireUserAPI();
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const userId = auth.session.user.id;

    // Verify ownership
    const existing = await prisma.project.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, description, config, status } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name.trim();
    if (description !== undefined)
      data.description = description?.trim() || null;
    if (config !== undefined) data.config = config as Prisma.InputJsonValue;
    if (
      status !== undefined &&
      ["discovery", "active", "delivered", "paused"].includes(status)
    ) {
      data.status = status;
    }

    const project = await prisma.project.update({
      where: { id },
      data,
    });

    await logActivity("project.updated", "project", project.id, userId, {
      fields: Object.keys(data),
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("[user/projects/id] PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireUserAPI();
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const userId = auth.session.user.id;

    const existing = await prisma.project.findFirst({
      where: { id, userId },
      select: { id: true, name: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });

    await logActivity("project.deleted", "project", id, userId, {
      name: existing.name,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[user/projects/id] DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
