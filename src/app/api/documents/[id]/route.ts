import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { id } = await params;
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(document.path ?? "", 60, {
      download: document.filename, // optional: proper download name
    });
  
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }
  
  return NextResponse.redirect(data.signedUrl ?? "");
}
