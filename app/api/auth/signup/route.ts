import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
const connectToDatabase = require("@/lib/db");

// ✅ Input sanitization
function sanitizeInput(input: string): string {
  return typeof input === "string" ? input.replace(/[$.]/g, "").trim() : input;
}

function isValidName(name: string): boolean {
  return /^[a-zA-Z\s]+$/.test(name);
}

function isFullNameValid(name: string): boolean {
  return isValidName(name) && name.trim().split(/\s+/).length >= 2;
}

function isValidPhone(phone: string): boolean {
  return /^(\+92\d{10}|\d{10})$/.test(phone);
}

function isValidCity(city: string): boolean {
  return /^[a-zA-Z\s]+$/.test(city);
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
    let { name, city, phone, receiverNetwork, division, farmsize, role, country } = body;

    name = capitalizeWords(sanitizeInput(name));
    city = capitalizeWords(sanitizeInput(city));
    phone = sanitizeInput(phone);

    console.log(body)

    // ✅ Validate input
    if (!isFullNameValid(name)) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ success: false, message: "Invalid phone number." }, { status: 400 });
    }

    if (!phone.startsWith("+92")) {
      phone = `+92${phone}`;
    }

    if (!isValidCity(city)) {
      return NextResponse.json({ success: false, message: "City must contain only letters and spaces." }, { status: 400 });
    }






    // ✅ Connect to DB and check if user already exists
    const client = await connectToDatabase();
    const database = client.db("WaterVation");
    const collection = database.collection("Users");

    console.log("hello")

    const existingUser = await collection.findOne({ phone });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "A user with this phone number already exists." },
        { status: 409 }
      );
    }

    console.log("hello1")

    // 🔹 Generate and store OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(otp)

    const APIKey = process.env.VEEVO_API_KEY;
    if (!APIKey) throw new Error("VEEVO_API_KEY is missing.");

    const message = `Your OTP code for Aab Pashi by Farmovation is ${otp}. Do not share it with anyone.`;

    const response = await fetch("https://api.veevotech.com/v3/sendsms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hash: APIKey,
        receivernum: phone,
        receivernetwork: receiverNetwork,
        sendernum: "Default",
        textmessage: message,
      }),
    });

    const responseData = await response.json();

    if (!response.ok || responseData.STATUS !== "SUCCESSFUL") {
      return NextResponse.json(
        { success: false, message: "Failed to send OTP", error: responseData },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      name, 
      city, 
      phone, 
      receiverNetwork, 
      division, 
      farmsize, 
      role, 
      country
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process signup",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
