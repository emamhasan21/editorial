import { z } from "zod";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { apiError, requireRoleManager } from "@/lib/api";

export const dynamic = "force-dynamic";

const publicationInput = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
  locale: z.enum(["bn", "en"]),
});

export async function PATCH(request: Request) {
  const user = await requireRoleManager(request);
  if (!user) return apiError("Administrator permission required", 403);
  const parsed = publicationInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid publication settings", 422, parsed.error.flatten());
  await db.insert(settings).values({ key: "publication", value: parsed.data }).onDuplicateKeyUpdate({ set: { value: parsed.data } });
  return Response.json({ data: parsed.data });
}
