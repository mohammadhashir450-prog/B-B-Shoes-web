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

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Welcome Admin! This is an admin-only route",
    user: session.user,
  });
}
