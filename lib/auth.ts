
import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { cache } from "react";


// KONFIGURASI SESI

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 Hari (Refresh jika sisa < 15 hari)
const SESSION_MAX_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 Hari (Total durasi sesi)

// TIPE DATA & INTERFACE

// Tipe data Session yang akan kita gunakan di aplikasi
export interface Session {
	id: string;
	userId: number;
	expiresAt: Date;
}

// Tipe User (tanpa password)
export interface User {
	id: number;
    email: string;
	name: string;
    role: string;
}

// Hasil Validasi Session
type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

// FUNGSI UTAMA: MANAGEMENT SESSION

/**
 * Membuat token sesi baru (random string) secara aman.
 * Menggunakan Base32 encoding agar URL-safe dan mudah dibaca.
 */
export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

/**
 * Membuat sesi baru di database.
 * 
 * Konsep Security:
 * Kita tidak menyimpan token mentah di database jika ingin extra secure,
 * tapi untuk tutorial ini kita simpan token ID (hash) sebagai identifier.
 * 
 * @param token - Token sesi yang belum di-hash
 * @param userId - ID user pemilik sesi
 */
export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS)
	};

	await prisma.session.create({
		data: {
            id: session.id,
            userId: session.userId,
            expiresAt: session.expiresAt
        }
	});

	return session;
}

/**
 * Validasi Session Token.
 * Fungsi ini akan dipanggil di setiap request/halaman yang butuh auth.
 * 
 * Flow:
 * 1. Hash token dari cookie.
 * 2. Cari session di database berdasarkan hash tersebut.
 * 3. Jika expired -> Hapus session -> Return null.
 * 4. Jika hampir expired (Refresh Interval) -> Perpanjang expired date -> Update DB.
 * 5. Return session & user.
 */
export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	
    // Mengambil session beserta data user-nya (join)
    const result = await prisma.session.findUnique({
		where: {
			id: sessionId
		},
		include: {
			user: true
		}
	});

	if (result === null) {
		return { session: null, user: null };
	}

	const { user, ...session } = result;

    // Cek apakah sudah expired
	if (Date.now() >= session.expiresAt.getTime()) {
		await prisma.session.delete({ where: { id: sessionId } });
		return { session: null, user: null };
	}

    // Refresh session jika masa aktif tinggal sedikit (Roll-over session)
	if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS) {
		session.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);
		await prisma.session.update({
			where: {
				id: session.id
			},
			data: {
				expiresAt: session.expiresAt
			}
		});
	}

	return { session, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

/**
 * Menghapus sesi (Logout).
 */
export async function invalidateSession(sessionId: string): Promise<void> {
	await prisma.session.delete({ where: { id: sessionId } });
}

// FUNGSI UTAMA: MANAGEMENT COOKIE

/**
 * Set cookie sesi di browser user.
 * Menggunakan konfigurasi secure (HttpOnly, SameSite, Secure).
 */
export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set("session", token, {
		httpOnly: true, // Tidak bisa diakses via JS client (mencegah XSS attack mencuri session)
		sameSite: "lax", // Hanya dikirim same-site (CSRF protection basic)
		secure: process.env.NODE_ENV === "production", // Hanya dikirim via HTTPS di production
		expires: expiresAt,
		path: "/"
	});
}

/**
 * Hapus cookie sesi dari browser user (untuk Logout).
 */
export async function deleteSessionTokenCookie(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 0,
		path: "/"
	});
}

/**
 * Helper untuk mendapatkan user yang sedang login di Server Component.
 * Gunakan ini di `layout.tsx`, `page.tsx`, atau API route.
 */
export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value ?? null;
	if (token === null) {
		return { session: null, user: null };
	}
	const result = await validateSessionToken(token);
	return result;
});


// FUNGSI UTAMA: MANAGEMENT PASSWORD

/**
 * Hash password menggunakan algoritma Bcrypt (fallback dari Argon2).
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

/**
 * Verifikasi password dengan hash yang tersimpan menggunakan Bcrypt.
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
