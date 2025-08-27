import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

export async function GET(req: NextRequest) {
  try {
    // Read the OpenAPI YAML file
    const openapiPath = join(process.cwd(), "docs", "openapi.yaml");
    const yamlContent = readFileSync(openapiPath, "utf8");
    
    // Parse YAML to JSON
    const openapiSpec = yaml.load(yamlContent);
    
    // Set appropriate headers for JSON response
    const headers = new Headers({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    
    return new NextResponse(JSON.stringify(openapiSpec, null, 2), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error serving OpenAPI spec:", error);
    return NextResponse.json(
      { 
        error: "Failed to load OpenAPI specification",
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