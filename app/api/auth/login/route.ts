import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured in environment" },
        { status: 500 },
      );
    }

    if (password === adminPassword) {
      // Create response and set HTTP-only cookie
      const response = NextResponse.json({ success: true });

      // Set to 7 days expiration
      const maxAge = 60 * 60 * 24 * 7;

      response.cookies.set({
        name: "admin-auth",
        value: "true",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: maxAge,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
