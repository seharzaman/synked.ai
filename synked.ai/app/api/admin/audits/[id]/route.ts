import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const audit = await prisma.auditReport.findUnique({
    where: { id },
    include: {
      company: { select: { id: true, name: true } },
      client: { select: { id: true, name: true } },
      projects: { select: { id: true, name: true, status: true } },
    },
  });

  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  return NextResponse.json(audit);
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

  const audit = await prisma.auditReport.update({
    where: { id },
    data: {
      companyId: body.companyId ?? undefined,
      clientId: body.clientId ?? undefined,
      status: body.status ?? undefined,
    },
  });

  return NextResponse.json(audit);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  await prisma.auditReport.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
