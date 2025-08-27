import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import redis from "@/lib/redis";
const connectToDatabase = require("@/lib/db");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const secretKeyUint8 = new TextEncoder().encode(SECRET_KEY);

async function generateAuthToken(
  userId: string,
  phone: string
): Promise<string> {
  return new SignJWT({ userId, phone })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secretKeyUint8);
}

async function generateMetaToken(
  userId: string,
  division: string,
  fullName: string
): Promise<string> {
  return new SignJWT({ userId, division, fullName })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secretKeyUint8);
}

async function generateMetaToken1(
  name: string,
  phone: string,
  city: string,
  country: string,
  division: string,
  farmsize: string,
  role: string
): Promise<string> {
  return new SignJWT({ name, phone, city, country, division, farmsize, role })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secretKeyUint8);
}

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, otp } = await req.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone and OTP required" },
        { status: 400 }
      );
    }

    const storedOtp = await redis.get(`otp:${phoneNumber}`);
    if (!storedOtp) {
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    if (storedOtp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    await redis.del(`otp:${phoneNumber}`);

    const client = await connectToDatabase();
    const db = client.db("WaterVation");
    const collection = db.collection("Users");

    const user = await collection.findOne({ phone: phoneNumber });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userId = user._id.toString();
    const authToken = await generateAuthToken(userId, phoneNumber);
    const metaToken = await generateMetaToken(userId, user.division, user.name);
    const metaToken1 = await generateMetaToken1(user.name, user.phone, user.city, user.country, user.division, user.farmsize, user.role);


    // 20 years in seconds
    const INFINITE_AGE = 20 * 365 * 24 * 60 * 60;

    cookies().set("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: INFINITE_AGE,
      path: "/",
    });

    cookies().set("meta_token", metaToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: INFINITE_AGE,
      path: "/",
    });

    cookies().set("meta_token1", metaToken1, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: INFINITE_AGE,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "OTP login failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
