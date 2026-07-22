import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "crypto";

function isValidSecret(provided: string | null): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  if (!provided || !expected) return false;
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  if (providedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(providedBuf, expectedBuf);
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  if (!isValidSecret(secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paths } = (await req.json()) as { paths: string[] };
  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ error: "No paths provided" }, { status: 400 });
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths });
}
