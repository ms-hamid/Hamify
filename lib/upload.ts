"use server";

import { supabase } from "./supabase";

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
