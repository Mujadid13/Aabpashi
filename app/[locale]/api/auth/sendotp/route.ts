import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let { phoneNumber, receiverNetwork } = body;

    // 🔹 Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // 🔹 Check if OTP was requested recently
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

    // 🔹 Store OTP in Redis with a 5-minute expiration
    await redis.setex(`otp:${phoneNumber}`, 300, otp);

    // 🔹 Ensure API key is available
    const APIKey = process.env.VEEVO_API_KEY;
    if (!APIKey) {
      throw new Error("VEEVO_API_KEY is missing in environment variables.");
    }

    const sender = "Default"; // Use default sender if not specified
    const message = `Your OTP code for Aab Pashi by Farmovation is ${otp}. Do not share it with anyone.`;

    // 🔹 Send OTP via VeevoTech API
    const response = await fetch("https://api.veevotech.com/v3/sendsms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hash: APIKey,
        receivernum: phoneNumber,
        receivernetwork: receiverNetwork, // ✅ Now correctly passing this param
        sendernum: sender,
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
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error sending OTP",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
