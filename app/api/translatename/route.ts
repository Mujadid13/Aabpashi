import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, target } = body;

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    // ✅ Only allow Pakistani languages: Urdu, Punjabi (Shahmukhi), Sindhi
    const allowedTargets = ["ur", "pa", "sd"];
    const safeTarget = allowedTargets.includes(target) ? target : "ur";

    const isArray = Array.isArray(text);
    const chunks = isArray
      ? Array.from({ length: Math.ceil(text.length / 64) }, (_, i) =>
          text.slice(i * 64, i * 64 + 64)
        )
      : [[text]];

    const allTranslations: string[] = [];

    for (const chunk of chunks) {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: chunk,
            target: safeTarget,
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

      allTranslations.push(...translations);
    }

    return NextResponse.json({
      translation: isArray ? allTranslations : [allTranslations[0]],
    });
  } catch (err) {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
