import { getSession } from "@/lib/auth-server";

export async function requireUserAPI() {
  const session = await getSession();
  if (!session) {
    return {
      error: "Unauthorized" as const,
      status: 401 as const,
      session: null,
    };
  }

  return { error: null, status: 200 as const, session };
}
