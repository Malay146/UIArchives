import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear the admin-auth cookie
  response.cookies.set({
    name: "admin-auth",
    value: "",
    httpOnly: true,
    expires: new Date(0), // expire immediately
    path: "/",
  });

  return response;
}
