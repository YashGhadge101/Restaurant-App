import cloudinary from "./Cloudinary"; // adjust path if needed
import { Express } from "express";

/**
 * Uploads an image file to Cloudinary using base64 Data URI
 * @param file Express.Multer.File
 * @returns Promise<string> - secure URL of the uploaded image
 */
const uploadImageOnCloudinary = async (file: Express.Multer.File): Promise<string> => {
  try {
    const base64Image = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: "menu-images", // optional: organize in Cloudinary
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

export default uploadImageOnCloudinary;
