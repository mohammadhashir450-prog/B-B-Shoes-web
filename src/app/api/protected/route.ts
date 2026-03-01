import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized - Please login" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "This is a protected route",
    user: session.user,
  });
}
