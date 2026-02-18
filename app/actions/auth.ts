
"use server"; // SERVER ACTIONS - Kode ini hanya berjalan di server

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { 
    hashPassword, 
    verifyPassword, 
    createSession, 
    generateSessionToken, 
    setSessionTokenCookie, 
    deleteSessionTokenCookie, 
    invalidateSession, 
    getCurrentSession 
} from "@/lib/auth";
import { redirect } from "next/navigation";

// VALIDASI INPUT (ZOD SCHEMA)

// Schema untuk Register
const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

// Schema untuk Login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password wajib diisi"),
});

// SERVER ACTIONS

/**
 * Action untuk REGISTER User baru
 */
export async function registerAction(prevState: any, formData: FormData) {
    // 1. Ambil data dari form
    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    };

    // 2. Validasi Input
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
    }

    const { name, email, password } = parsed.data;

    try {
        // 3. Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: { email: ["Email sudah digunakan"] } }; // Return error spesifik field
        }

        // 4. Hash Password (SECURITY CRITICAL)
        // Kita tidak boleh menyimpan password mentah (plain text) di database
        const hashedPassword = await hashPassword(password);

        // 5. Simpan User ke Database
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                // role default 'customer' (diatur di schema.prisma)
            },
        });

        // 6. Auto-Login setelah Register (Opsional, tapi UX bagus)
        // Buat session baru untuk user yang baru dibuat
        const token = generateSessionToken();
        const session = await createSession(token, newUser.id);
        
        // 7. Simpan session token di cookie browser (HttpOnly)
        await setSessionTokenCookie(token, session.expiresAt);

    } catch (err) {
        console.error("Register Error:", err);
        return { message: "Terjadi kesalahan internal server" }; // General error
    }

    // 8. Redirect ke halaman dashboard/home
    // Redirect harus di luar try-catch karena dia melempar error NEXT_REDIRECT
    return redirect("/"); 
}

/**
 * Action untuk LOGIN User
 */
export async function loginAction(prevState: any, formData: FormData) {
    // 1. Ambil & Validasi Data
    const data = Object.fromEntries(formData);
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
    }
    
    const { email, password } = parsed.data;

    try {
        // 2. Cari User berdasarkan Email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // 3. Verifikasi User & Password
        // Gunakan teknik "Constant Time" atau flow yang sama untuk user tidak ditemukan & password salah
        // untuk mencegah User Enumeration Attack (tapi untuk belajar, kita return detail saja gapapa)
        if (!user) {
            return { message: "Email atau password salah" };
        }

        const isValidPassword = await verifyPassword(user.password, password);
        if (!isValidPassword) {
            return { message: "Email atau password salah" };
        }

        // 4. Buat Session Baru
        const token = generateSessionToken();
        const session = await createSession(token, user.id);
        
        // 5. Set Cookie
        await setSessionTokenCookie(token, session.expiresAt);

    } catch (err) {
        return { message: "Terjadi kesalahan saat login" };
    }

    // 6. Redirect
    return redirect("/");
}


