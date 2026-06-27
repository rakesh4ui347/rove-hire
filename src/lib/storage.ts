import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

export async function ensureUploadDir(subdir?: string) {
  const dir = subdir ? path.join(UPLOAD_DIR, subdir) : UPLOAD_DIR;
  await mkdir(dir, { recursive: true });
  return dir;
}

export async function saveFile(
  filename: string,
  data: Buffer,
  subdir?: string
): Promise<string> {
  const dir = await ensureUploadDir(subdir);
  const filePath = path.join(dir, filename);
  await writeFile(filePath, data);
  return filePath;
}

export async function readFileFromDisk(filePath: string): Promise<Buffer> {
  return readFile(filePath);
}

export function getRelativePath(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath).replace(/\\/g, "/");
}
