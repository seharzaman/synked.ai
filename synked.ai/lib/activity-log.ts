import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function logActivity(
  action: string,
  entityType: string,
  entityId: string,
  userId?: string,
  details?: Record<string, unknown>,
) {
  return prisma.activityLog.create({
    data: {
      action,
      entityType,
      entityId,
      userId: userId ?? null,
      details: (details ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
}
