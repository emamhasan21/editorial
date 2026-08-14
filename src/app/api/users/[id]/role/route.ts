import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { apiError, requireRoleManager } from "@/lib/api";
import { systemRoles } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const roleInput = z.object({ role: z.enum(systemRoles) });

export async function PATCH(request: Request, context: RouteContext<"/api/users/[id]/role">) {
  const requester = await requireRoleManager(request);
  if (!requester) return apiError("Administrator permission required", 403);
  const { id } = await context.params;
  const parsed = roleInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid role", 422, parsed.error.flatten());

  const [target] = await db.select({ id: users.id, role: users.role }).from(users).where(eq(users.id, id)).limit(1);
  if (!target) return apiError("User not found", 404);
  const nextRole = parsed.data.role;

  if (target.id === requester.id && nextRole !== target.role) return apiError("You cannot change your own role", 409);
  if (target.role === "owner" && requester.role !== "owner") return apiError("Only an owner can manage another owner", 403);
  if (nextRole === "owner" && requester.role !== "owner") return apiError("Only an owner can assign the owner role", 403);

  if (target.role === "owner" && nextRole !== "owner") {
    const [ownerCount] = await db.select({ value: count() }).from(users).where(eq(users.role, "owner"));
    if ((ownerCount?.value ?? 0) <= 1) return apiError("The final owner cannot be demoted", 409);
  }

  await db.update(users).set({ role: nextRole }).where(eq(users.id, target.id));
  return Response.json({ data: { id: target.id, role: nextRole } });
}
