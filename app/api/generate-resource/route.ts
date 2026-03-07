import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";
import { scrapeMetadata } from "@/lib/scrapeMetadata";

// Ensure Node.js runtime for file handling
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const url = formData.get("url") as string;
    const file = formData.get("image") as File | null;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log("Scraping metadata for", url);
    const scrapedData = await scrapeMetadata(url);

    let finalImageUrl = "";

    let bufferToUpload: Buffer | null = null;

    // Use uploaded image file only!
    if (file && file.size > 0) {
      console.log("Using uploaded image file...");
      const arrayBuffer = await file.arrayBuffer();
      bufferToUpload = Buffer.from(arrayBuffer);
    } else {
      console.log("No image file uploaded. Skipping Cloudinary upload.");
    }

    // Upload to Cloudinary if we have an uploaded buffer
    if (bufferToUpload) {
      try {
        console.log("Uploading image to Cloudinary...");
        finalImageUrl = await uploadToCloudinary(bufferToUpload, "resources");
      } catch (err: any) {
        console.error("Could not upload to cloudinary:", err.message);
      }
    }

    console.log("Done generating resource");

    return NextResponse.json({
      title: scrapedData.title,
      description: scrapedData.description,
      tag: scrapedData.tags,
      image: finalImageUrl,
      links: scrapedData.links,
    });
  } catch (error: any) {
    console.error("Error in generate-resource API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate resource" },
      { status: 500 },
    );
  }
}
