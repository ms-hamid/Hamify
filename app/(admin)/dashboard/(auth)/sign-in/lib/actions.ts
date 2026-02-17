"use server"

import { redirect } from "next/navigation"
import { ActionResult } from "@/types"
import { schemaSignIn } from "@/lib/schema"
import { prisma } from "@/lib/prisma"
import { createSession, generateSessionToken, setSessionTokenCookie, verifyPassword } from "@/lib/auth"

// export the function to be used in client component
export async function SignIn(
    prevState: ActionResult | undefined,
    formData: FormData
): Promise<ActionResult> {
    const validate = schemaSignIn.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    })

    if (!validate.success) {
        return {
            error: validate.error.issues[0].message
        }
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            email: validate.data.email,
            role: 'superadmin'
        }
    })

    if (!existingUser) {
        return {
            error: "Email not found"
        }
    }

    // Gunakan verifyPassword dari @/lib/auth (Argon2) yang lebih aman daripada bcrypt
    const isValidPassword = await verifyPassword(existingUser.password, validate.data.password)

    if (!isValidPassword) {
        return {
            error: "Email or password is incorrect"
        }
    }

    // Buat session baru
    const token = generateSessionToken()
    await createSession(token, existingUser.id)
    await setSessionTokenCookie(token, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)) // 30 hari

    redirect('/dashboard')
}