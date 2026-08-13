import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { reactions } from "@/db/schema";
import { apiError, getRequestUser } from "@/lib/api";

const inputSchema = z.object({ kind: z.enum(["clap", "like"]).default("clap"), amount: z.number().int().min(1).max(10).default(1) });

export async function POST(request: Request, context: RouteContext<"/api/posts/[id]/reactions">) {
  const user = await getRequestUser(request);
  if (!user) return apiError("Sign in to react", 401);
  const { id: postId } = await context.params;
  const parsed = inputSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return apiError("Invalid reaction", 422);
  const { kind, amount } = parsed.data;
  const existing = await db.select().from(reactions).where(and(eq(reactions.postId, postId), eq(reactions.userId, user.id), eq(reactions.kind, kind))).limit(1);
  if (existing[0]) {
    await db.update(reactions).set({ amount: sql`least(${reactions.amount} + ${amount}, 50)` }).where(eq(reactions.id, existing[0].id));
  } else {
    await db.insert(reactions).values({ id: nanoid(), postId, userId: user.id, kind, amount });
  }
  return Response.json({ data: { accepted: true } });
}
