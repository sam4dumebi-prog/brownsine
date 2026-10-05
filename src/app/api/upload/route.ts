import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("You must be logged in to upload files.", 401);

  const form = await req.formData().catch(() => null);
  if (!form) return jsonError("Invalid form data.");

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return jsonError("No files provided.");

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return jsonError(`Unsupported file type: ${file.type}`);
    }
    if (file.size > MAX_SIZE) {
      return jsonError("File too large. Max 8MB per file.");
    }
    const ext = file.type.split("/")[1] ?? "jpg";
    const filename = `${newId("up")}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    urls.push(`/uploads/${filename}`);
  }

  return jsonOk({ urls });
}
