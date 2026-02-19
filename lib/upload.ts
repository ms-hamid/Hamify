"use server";

import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file uploaded" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, "-")}`;
  
  // Save to public/uploads
  const path = join(process.cwd(), "public/uploads", filename);
  
  try {
    await writeFile(path, buffer);
    return { url: `/uploads/${filename}` };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to save file" };
  }
}
