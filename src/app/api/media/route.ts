import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { db } from "@/db";
import { media } from "@/db/schema";
import { apiError, getRequestUser } from "@/lib/api";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const maxBytes = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getRequestUser(request);
  if (!user) return apiError("Authentication required", 401);
  const form = await request.formData();
  const upload = form.get("file");
  if (!(upload instanceof File)) return apiError("Choose an image to upload", 422);
  if (!allowedTypes.has(upload.type)) return apiError("Unsupported image type", 415);
  if (upload.size > maxBytes) return apiError("Image must be 10 MB or smaller", 413);

  const id = nanoid();
  const input = Buffer.from(await upload.arrayBuffer());
  const pipeline = sharp(input, { animated: false }).rotate();
  const metadata = await pipeline.metadata();
  if (!metadata.width || !metadata.height) return apiError("Image could not be decoded", 422);

  const folder = path.join(process.cwd(), "public", "uploads", new Date().getUTCFullYear().toString());
  await mkdir(folder, { recursive: true });
  const filename = `${id}.webp`;
  const destination = path.join(folder, filename);
  const output = await pipeline.resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer({ resolveWithObject: true });
  await writeFile(destination, output.data);
  const storagePath = `/uploads/${new Date().getUTCFullYear()}/${filename}`;

  await db.insert(media).values({
    id, ownerId: user.id, filename: upload.name.slice(0, 255), storagePath,
    mimeType: "image/webp", size: output.data.length,
    width: output.info.width, height: output.info.height,
    alt: String(form.get("alt") ?? "").slice(0, 500) || null,
    metadata: { originalMimeType: upload.type, originalBytes: upload.size },
  });

  return Response.json({ data: { id, url: storagePath, width: output.info.width, height: output.info.height, size: output.data.length } }, { status: 201 });
}
