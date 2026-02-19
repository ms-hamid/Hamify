"use server";

import { supabase } from "./supabase";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./constants";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file uploaded" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate file type
  // Validate file type
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { error: `Invalid file type. Only JPEG, PNG, and WebP are allowed.` };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { error: `File size too large. Max ${MAX_FILE_SIZE / (1024 * 1024)}MB.` };
  }

  // Create unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, "-")}`;

  try {
    const { data, error } = await supabase.storage
      .from("belanja")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { error: `Failed to upload file to Supabase: ${error.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("belanja")
      .getPublicUrl(filename);

    return { url: publicUrlData.publicUrl };
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return { error: "Failed to save file" };
  }
}

export async function deleteFile(publicUrl: string) {
  try {
    // Extract file path from public URL
    // URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path/to/file]
    // Extract file path from public URL
    // URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path/to/file]
    
    // Kita gunakan satu logic split yang sudah terbukti benar untuk project ini
    const parts = publicUrl.split("/storage/v1/object/public/belanja/");
    
    if (parts.length < 2) {
      console.error("Invalid Supabase public URL format");
      return { error: "Invalid URL format" };
    }

    const filePath = parts[1];
    
    // console.log("Extracted file path:", filePath); // Optional: keep for debug or remove

    const { error } = await supabase.storage
      .from("belanja")
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return { error: `Failed to delete file: ${error.message}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected delete error:", error);
    return { error: "Failed to delete file" };
  }
}
