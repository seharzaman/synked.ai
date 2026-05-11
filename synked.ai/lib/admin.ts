import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    redirect("/dashboard");
  }

  return session;
}

export async function requireAdminAPI() {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized", status: 401 as const, session: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    return { error: "Forbidden", status: 403 as const, session: null };
  }

  return { error: null, status: 200 as const, session };
}
