import { auth } from "@/lib/auth";

export async function getRequestUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

export function apiError(message: string, status = 400, details?: unknown) {
  return Response.json({ error: { message, details } }, { status });
}
