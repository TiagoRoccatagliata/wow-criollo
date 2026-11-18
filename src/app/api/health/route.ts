import { db } from "@/server/db";

export async function GET() {
  const headers = { "Cache-Control": "no-store" };

  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" }, { headers });
  } catch {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers },
    );
  }
}
