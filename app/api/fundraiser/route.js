import { connectToDB } from "@/utils/database";
import Fundraiser from "@/models/fundraiser";
import { verifyToken } from "@/utils/jwt";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import multer from "multer";


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
    const formData= await req.formData();
    const fundraiserData=Object.fromEntries(formData.entries());

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "goalAmount",
      
      "patientName",
      
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
    const uploadToCloudinary = async (file, folder) => {
      if (!file) {
        throw new Error(`${folder} file is required`);
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        ).end(buffer);
      });
    };
    const [patientImageUrl, medicalDocumentUrl, qrCodeUrl] = await Promise.all([
      uploadToCloudinary(formData.get('patientImage'), 'patient_images'),
      uploadToCloudinary(formData.get('medicalDocument'), 'medical_documents'),
      uploadToCloudinary(formData.get('qrCode'), 'qr_codes')
    ]);
   

    // Create unique fundraiser ID
    const fundraiserID = uuidv4();


    // Create a new fundraiser record
    const newFundraiser = new Fundraiser({
      title: formData.get('title'),
      description: formData.get('description'),
      goalAmount: parseFloat(formData.get('goalAmount')),
      patientImage: patientImageUrl,
      patientName: formData.get('patientName'),
      medicalDocument: medicalDocumentUrl,
      qrCode: qrCodeUrl,
      fundraiserID,
      category: formData.get('category'),
      userID,
      beneficiary: formData.get('beneficiary'),
      deadline: new Date(formData.get('deadline')),
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
export async function GET(req) {
  try {
    await connectToDB();

    const fundraisers = await Fundraiser.find({});
    return NextResponse.json(fundraisers, { status: 200 });
  } catch (error) {
    console.error("Error retrieving fundraisers:", error);
    return NextResponse.json(
      { error: "Failed to retrieve fundraisers", details: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const token = await req.cookies.get("authToken");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token not provided" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token.value);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userID = decoded.id; // Ensure only the owner can delete their campaigns
    const url = new URL(req.url);
    const fundraiserID = url.searchParams.get("fundraiserID");

    if (!fundraiserID) {
      return NextResponse.json(
        { error: "Fundraiser ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if the fundraiser exists and belongs to the authenticated user
    const fundraiser = await Fundraiser.findOne({ fundraiserID });

    if (!fundraiser) {
      return NextResponse.json(
        { error: "Fundraiser not found" },
        { status: 404 }
      );
    }

    if (fundraiser.userID !== userID) {
      return NextResponse.json(
        { error: "Unauthorized: You cannot delete this fundraiser" },
        { status: 403 }
      );
    }

    // Delete fundraiser from the database
    await Fundraiser.deleteOne({ fundraiserID });

    return NextResponse.json(
      { message: "Fundraiser deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting fundraiser:", error);
    return NextResponse.json(
      { error: "Failed to delete fundraiser", details: error.message },
      { status: 500 }
    );
  }
}




