import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
const connectToDatabase = require("@/lib/db");

// ✅ Phone validation
function isValidPhone(phone: string): boolean {
  return /^(\+92\d{10}|\d{10})$/.test(phone);
}

// ✅ Input sanitization
function sanitizeInput(input: string): string {
  if (typeof input === "string") {
    return input.replace(/[$.]/g, "").trim();
  }
  return input;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { phoneNumber } = body;

    // ✅ Validate input presence
    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
        },
        { status: 400 }
      );
    }

    phoneNumber = sanitizeInput(phoneNumber);

    // ✅ Validate phone format
    if (!isValidPhone(phoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone number format. Use +92XXXXXXXXXX",
        },
        { status: 400 }
      );
    }

    // ✅ Normalize phone number to +92
    if (!phoneNumber.startsWith("+92")) {
      phoneNumber = `+92${phoneNumber}`;
    }

    // ✅ Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db("WaterVation");
    const usersCollection = db.collection("Users");

    // ✅ Check if user exists
    const user = await usersCollection.findOne({ phone: phoneNumber });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "This phone number is not registered. Please sign up first.",
        },
        { status: 401 }
      );
    }

    const receiverNetwork = user.receiverNetwork;

    // ✅ Check for existing OTP (rate limiting)
    const existingOtp = await redis.get(`otp:${phoneNumber}`);
    if (existingOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP already sent. Please wait before requesting again.",
        },
        { status: 429 }
      );
    }

    // ✅ Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // ✅ Store OTP in Redis (5-minute expiry)
    await redis.setex(`otp:${phoneNumber}`, 300, otp);

    // ✅ Veevo API Key
    const APIKey = process.env.VEEVO_API_KEY;
    if (!APIKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Server misconfiguration: missing Veevo API key.",
        },
        { status: 500 }
      );
    }

    const message = `Your OTP code for Aab Pashi by Farmovation is ${otp}. Do not share it with anyone.`;

    // ✅ Send SMS via Veevo API
    const response = await fetch("https://api.veevotech.com/v3/sendsms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hash: APIKey,
        receivernum: phoneNumber,
        receivernetwork: receiverNetwork,
        sendernum: "Default",
        textmessage: message,
      }),
    });

    const responseData = await response.json();

    if (!response.ok || responseData.STATUS !== "SUCCESSFUL") {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send OTP",
          error: responseData,
        },
        { status: 500 }
      );
    }

    // ✅ Success
    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
        phoneNumber,
        id: user._id.toString(),
        division: user.division,
        name: user.name,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during OTP login",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
