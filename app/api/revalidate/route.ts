// app/api/revalidate/route.ts
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path") || "/";

  revalidatePath(path);

  return Response.json({ revalidated: true, now: Date.now() });
}
