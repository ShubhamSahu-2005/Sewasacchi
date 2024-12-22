import { connectToDB } from "@/utils/database";
import Fundraiser from "@/models/fundraiser";
import { verifyToken } from "@/utils/jwt";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Extract the token from cookies
    const token =  await req.cookies.get("authToken");
    console.log("token is",token);

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token not provided" },
        { status: 401 }
      );
    }

    // Verify the token
    let decoded;
    try {
      decoded = verifyToken(token.value);
      console.log(decoded);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userID = decoded.id; // Extract the user ID from the token

    // Connect to the database
    await connectToDB();

    // Parse the request body
    const body = await req.json();
    const {
      title,
      description,
      goalAmount,
      patientImage,
      patientName,
      medicalDocument,
      qrCode,
      category,
      beneficiary,
      deadline,
    } = body;

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "goalAmount",
      "patientImage",
      "patientName",
      "medicalDocument",
      "qrCode",
      "category",
      "beneficiary",
      "deadline",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field "${field}" is required` },
          { status: 400 }
        );
      }
    }

    // Create unique fundraiser ID
    const fundraiserID = uuidv4();

    // Create a new fundraiser record
    const newFundraiser = new Fundraiser({
      title,
      description,
      goalAmount,
      patientImage,
      patientName,
      medicalDocument,
      qrCode,
      fundraiserID,
      category,
      userID,
      beneficiary,
      deadline,
    });

    // Save the fundraiser to the database
    await newFundraiser.save();

    return NextResponse.json(
      { message: "Fundraiser created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating fundraiser:", error);
    return NextResponse.json(
      { error: "Failed to create fundraiser", details: error.message },
      { status: 500 }
    );
  }
}

