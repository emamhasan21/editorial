import { auth } from "@/lib/auth";
import { canCreateContent, canManageAuthors, canPublishContent } from "@/lib/permissions";

export async function getRequestUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

export function apiError(message: string, status = 400, details?: unknown) {
  return Response.json({ error: { message, details } }, { status });
}

export async function requireContentUser(request: Request) {
  const user = await getRequestUser(request);
  return user && canCreateContent(user.role) ? user : null;
}

export async function requirePublisher(request: Request) {
  const user = await getRequestUser(request);
  return user && canPublishContent(user.role) ? user : null;
}

export async function requireAuthorManager(request: Request) {
  const user = await getRequestUser(request);
  return user && canManageAuthors(user.role) ? user : null;
}
