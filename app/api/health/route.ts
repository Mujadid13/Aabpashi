import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "aabpashi-web",
      version: "1.0.0"
    },
    { status: 200 }
  );
} 