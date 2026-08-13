import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { comments, posts, users } from "@/db/schema";
import { apiError, getRequestUser } from "@/lib/api";

const commentInput = z.object({
  body: z.string().trim().min(2).max(5000),
  name: z.string().trim().min(2).max(120).optional(),
  email: z.email().max(320).optional(),
  parentId: z.string().max(24).optional(),
  company: z.string().max(0).optional(),
});

export async function GET(_: Request, context: RouteContext<"/api/posts/[id]/comments">) {
  const { id } = await context.params;
  const result = await db.select({ id: comments.id, body: comments.body, parentId: comments.parentId, likes: comments.likes, createdAt: comments.createdAt, author: users.name, guestName: comments.guestName }).from(comments).leftJoin(users, eq(comments.userId, users.id)).where(eq(comments.postId, id)).orderBy(asc(comments.createdAt));
  return Response.json({ data: result.map(({ guestName, ...comment }) => ({ ...comment, author: comment.author ?? guestName ?? "Guest" })) });
}

export async function POST(request: Request, context: RouteContext<"/api/posts/[id]/comments">) {
  const { id } = await context.params;
  const [post] = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) return apiError("Post not found", 404);
  const parsed = commentInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid comment", 422, parsed.error.flatten());
  if (parsed.data.company) return Response.json({ data: { accepted: true } }, { status: 202 });
  const user = await getRequestUser(request);
  if (!user && (!parsed.data.name || !parsed.data.email)) return apiError("Name and email are required", 422);
  const idValue = nanoid();
  await db.insert(comments).values({ id: idValue, postId: id, userId: user?.id, parentId: parsed.data.parentId, guestName: user ? null : parsed.data.name, guestEmail: user ? null : parsed.data.email, body: parsed.data.body, status: user ? "approved" : "pending" });
  return Response.json({ data: { id: idValue, status: user ? "approved" : "pending" } }, { status: 201 });
}
