import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import redis from "@/lib/redis";
const connectToDatabase = require("@/lib/db");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const secretKeyUint8 = new TextEncoder().encode(SECRET_KEY);

// ✅ Auth token (phone + userId)
async function generateAuthToken(
  userId: string,
  phone: string
): Promise<string> {
  return new SignJWT({ userId, phone })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secretKeyUint8);
}

// ✅ Meta token (division + name)
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
    const body = await req.json();
    const {
      phoneNumber,
      otp,
      name,
      city,
      division,
      receiverNetwork,
      farmsize,
      role,
      country,
    } = body;

    // ✅ Input check
    if (
      !phoneNumber ||
      !otp ||
      !name ||
      !division ||
      !city ||
      !role ||
      !country
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // ✅ Verify OTP
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

    // ✅ Insert user in DB
    const client = await connectToDatabase();
    const database = client.db("WaterVation");
    const collection = database.collection("Users");

    const newUser = {
      name,
      phone: phoneNumber,
      receiverNetwork,
      city,
      country,
      division,
      farmsize,
      role,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newUser);
    const insertedUser = await collection.findOne({ _id: result.insertedId });
    const userId = insertedUser?._id.toString();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User creation failed." },
        { status: 500 }
      );
    }

    // ✅ Generate tokens
    const authToken = await generateAuthToken(userId, phoneNumber);
    const metaToken = await generateMetaToken(userId, division, name);
    const metaToken1 = await generateMetaToken1(name, phoneNumber, city, country, division, farmsize, role);

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
      message: "OTP verified and user registered successfully.",
    });
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
