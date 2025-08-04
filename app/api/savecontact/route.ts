import { NextRequest, NextResponse } from "next/server";
const connectToDatabase = require("@/lib/db");

// ✅ Input sanitization
function sanitizeInput(input: string): string {
  return typeof input === "string" ? input.replace(/[$.]/g, "").trim() : "";
}

function isValidName(name: string): boolean {
  return /^[a-zA-Z\s]+$/.test(name);
}

function isValidPhone(phone: string): boolean {
  return /^(\+92\d{10}|\d{10})$/.test(phone);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { name, phone, email, userMessage } = body;

    name = capitalizeWords(sanitizeInput(name));
    email = sanitizeInput(email);
    phone = sanitizeInput(phone);
    userMessage = sanitizeInput(userMessage);

    if (!isValidName(name)) {
      return NextResponse.json({ success: false, message: "Please enter a valid name." }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ success: false, message: "Invalid phone number." }, { status: 400 });
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json({ success: false, message: "Invalid email address." }, { status: 400 });
    }

    if (!phone.startsWith("+92")) {
      phone = `+92${phone}`;
    }

    // ✅ Connect to DB
    const client = await connectToDatabase();
    const database = client.db("WaterVation");
    const collection = database.collection("contact");

    const newUser = {
      name,
      phone,
      ...(email ? { email } : {}), // include only if present
      userMessage,
      createdAt: new Date(),
    };

    await collection.insertOne(newUser);

    return NextResponse.json({
      success: true,
      message: "Contact saved successfully",
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process contact form",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
