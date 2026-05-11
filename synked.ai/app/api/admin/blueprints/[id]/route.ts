import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import { blueprintUpdateSchema } from "@/lib/validations/blueprint";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const blueprint = await prisma.blueprint.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true } },
      deliverables: {
        include: {
          project: { select: { id: true, name: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!blueprint) {
    return NextResponse.json({ error: "Blueprint not found" }, { status: 404 });
  }

  return NextResponse.json(blueprint);
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
  const parsed = blueprintUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) {
    const existing = await prisma.blueprint.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 },
      );
    }
    updateData.slug = data.slug;
  }
  if (data.description !== undefined) updateData.description = data.description;
  if (data.industry !== undefined) updateData.industry = data.industry;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.steps !== undefined)
    updateData.steps = data.steps as unknown as Prisma.InputJsonValue;
  if (data.estimatedHours !== undefined)
    updateData.estimatedHours = data.estimatedHours;
  if (data.estimatedROI !== undefined)
    updateData.estimatedROI = data.estimatedROI;
  if (data.tags !== undefined) updateData.tags = data.tags;

  const blueprint = await prisma.blueprint.update({
    where: { id },
    data: updateData,
  });

  await logActivity(
    "updated",
    "blueprint",
    blueprint.id,
    auth.session!.user.id,
    {
      fields: Object.keys(updateData),
    },
  );

  return NextResponse.json(blueprint);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  await prisma.blueprint.delete({ where: { id } });

  await logActivity("deleted", "blueprint", id, auth.session!.user.id);

  return NextResponse.json({ success: true });
}
