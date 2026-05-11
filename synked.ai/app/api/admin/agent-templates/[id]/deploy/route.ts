import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin";
import { logActivity } from "@/lib/activity-log";
import type { Prisma } from "@/generated/prisma/client";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAPI();
  if (auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const template = await prisma.agentTemplate.findUnique({ where: { id } });

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  // Create a new agent from this template
  const agent = await prisma.aIAgent.create({
    data: {
      name: `${template.name} (deployed)`,
      type: template.type,
      status: "offline",
      description: template.description,
      config: (template.baseConfig as Prisma.InputJsonValue) ?? undefined,
      templateId: template.id,
    },
  });

  // Increment template usage count
  await prisma.agentTemplate.update({
    where: { id },
    data: { usageCount: { increment: 1 } },
  });

  await logActivity("deployed", "ai_agent", agent.id, auth.session!.user.id, {
    name: agent.name,
    fromTemplate: template.id,
    templateName: template.name,
  });

  return NextResponse.json(agent, { status: 201 });
}
