import { NextRequest, NextResponse } from "next/server";

// Helper: split array into chunks of N
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { text, target = "ur" } = body;
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    if (!text || (Array.isArray(text) && text.length === 0)) {
      return NextResponse.json({ error: "No text to translate" }, { status: 400 });
    }

    const allowedTargets = ["ur", "pa", "sd"];
    if (!allowedTargets.includes(target)) {
      target = "ur";
    } else if (target === "pa") {
      target = "ur"; // Punjabi fallback to Urdu
    }

    const q = Array.isArray(text) ? text : [text];
    const chunks = chunkArray(q, 100); // Google limit = 128, we keep it at 100

    const allTranslations: string[] = [];

    for (const chunk of chunks) {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: chunk,
            target,
            format: "text",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.data?.translations) {
        console.error("❌ Google API error:", data);
        throw new Error("Google Translation API returned invalid response");
      }

      const translations = data.data.translations.map(
        (item: any) => item.translatedText
      );

      allTranslations.push(...translations);
    }

    return NextResponse.json({ translation: allTranslations });
  } catch (err) {
    console.error("❌ translate3canals error:", err);
    return NextResponse.json(
      { error: "Translation failed", message: (err as Error).message },
      { status: 500 }
    );
  }
}
