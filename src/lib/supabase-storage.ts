import { DocumentType } from "@prisma/client";

import { getSupabaseAdmin } from "./supabase";

export type StorageBucket = "resumes" | "offers" | "nda";

export function getStorageBucket(type: DocumentType): StorageBucket {
  switch (type) {
    case "RESUME":
      return "resumes";
    case "OFFER_LETTER":
      return "offers";
    case "NDA":
      return "nda";
  }
}

export async function uploadFile(
  bucket: StorageBucket,
  filename: string,
  buffer: Buffer
) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    throw formatStorageError(error, bucket);
  }

  return data.path;
}

function formatStorageError(error: { message: string }, bucket: StorageBucket) {
  if (error.message.includes("row-level security")) {
    return new Error(
      `Storage upload blocked for bucket "${bucket}". Set SUPABASE_SERVICE_ROLE_KEY to the service_role key (not anon) in .env, then run supabase/storage.sql in the Supabase SQL editor.`
    );
  }

  if (error.message.includes("Bucket not found")) {
    return new Error(
      `Storage bucket "${bucket}" does not exist. Create it in Supabase or run supabase/storage.sql.`
    );
  }

  return error;
}

export async function removeFiles(bucket: StorageBucket, paths: string[]) {
  if (paths.length === 0) {
    return;
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(bucket).remove(paths);

  if (error) {
    throw error;
  }
}

export async function removeDocumentFiles(
  documents: { path: string; type: DocumentType }[]
) {
  const grouped = new Map<StorageBucket, string[]>();

  for (const document of documents) {
    const bucket = getStorageBucket(document.type);
    const paths = grouped.get(bucket) ?? [];
    paths.push(document.path);
    grouped.set(bucket, paths);
  }

  await Promise.all(
    [...grouped.entries()].map(([bucket, paths]) =>
      removeFiles(bucket, paths)
    )
  );
}

export async function downloadFile(bucket: StorageBucket, path: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(bucket).download(path);

  if (error || !data) {
    throw error ?? new Error("File missing");
  }

  return Buffer.from(await data.arrayBuffer());
}
