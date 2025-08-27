import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { file: string[] } }
) {
  try {
    const filePath = params.file.join("/");
    const fullPath = join(process.cwd(), "docs", filePath);

    // Security check: ensure we're only serving files from the docs directory
    if (!fullPath.startsWith(join(process.cwd(), "docs"))) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Check if file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Read the file
    const content = readFileSync(fullPath, "utf8");

    // Determine content type based on file extension
    const extension = filePath.split(".").pop()?.toLowerCase();
    let contentType = "text/plain";
    
    switch (extension) {
      case "md":
        contentType = "text/markdown";
        break;
      case "yaml":
      case "yml":
        contentType = "text/yaml";
        break;
      case "json":
        contentType = "application/json";
        break;
      case "html":
        contentType = "text/html";
        break;
      default:
        contentType = "text/plain";
    }

    // Set appropriate headers
    const headers = new Headers({
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    });

    return new NextResponse(content, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error serving documentation file:", error);
    return NextResponse.json(
      { 
        error: "Failed to load documentation file",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
} 