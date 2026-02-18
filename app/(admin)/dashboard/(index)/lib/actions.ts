"use server";

import { redirect } from "next/navigation";
import { getCurrentSession, invalidateSession, deleteSessionTokenCookie } from "@/lib/auth";

/**
 * Action untuk LOGOUT
 */
export async function logoutAction() {
    // 1. Ambil session saat ini
    const { session } = await getCurrentSession();
    if (!session) {
        return redirect("/dashboard/sign-in");
    }

    // 2. Hapus session dari database
    await invalidateSession(session.id);

    // 3. Hapus cookie dari browser
    await deleteSessionTokenCookie();

    // 4. Redirect ke halaman login
    return redirect("/dashboard/sign-in");
}
