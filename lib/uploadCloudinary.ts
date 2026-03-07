import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = "UIArchives"
): Promise<string> {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return reject(error);
        }

        if (!result?.secure_url) {
          return reject(new Error("No secure_url returned"));
        }

        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);

  });
}