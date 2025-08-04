// app/api/translate3canals/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, target = "ur" } = body;
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const isArray = Array.isArray(text);
    const q = isArray ? text.slice(0, 3) : [text];

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q,
          target,
          format: "text",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data?.data?.translations) {
      throw new Error("Google Translation API returned invalid response");
    }

    const translations = data.data.translations.map(
      (item: any) => item.translatedText
    );

    return NextResponse.json({
      translation: isArray ? translations : [translations[0]],
    });
  } catch (err) {
    console.error("❌ translate3canals error:", err);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
