"use server"

import { redirect } from "next/navigation"
import { ActionResult } from "@/types"
import { schemaSignIn, schemaSignUp } from "@/lib/schema"
import { prisma } from "@/lib/prisma"
import { createSession, generateSessionToken, setSessionTokenCookie, verifyPassword, hashPassword } from "@/lib/auth"

export async function customerSignIn(
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

    // Hanya untuk user dengan role customer
    const existingUser = await prisma.user.findFirst({
        where: {
            email: validate.data.email,
            role: 'customer'
        }
    })

    if (!existingUser) {
        return {
            error: "Email not found"
        }
    }

    const isValidPassword = await verifyPassword(existingUser.password, validate.data.password)

    if (!isValidPassword) {
        return {
            error: "Email or password is incorrect"
        }
    }

    const token = generateSessionToken()
    await createSession(token, existingUser.id)
    await setSessionTokenCookie(token, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)) // 30 hari

    redirect('/')
}

export async function customerSignUp(
    prevState: ActionResult | undefined,
    formData: FormData
): Promise<ActionResult> {
    const validate = schemaSignUp.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validate.success) {
        return {
            error: validate.error.issues[0].message
        }
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            email: validate.data.email
        }
    })

    if (existingUser) {
        return {
            error: "Email is already taken"
        }
    }

    const hashedPassword = await hashPassword(validate.data.password)

    const newUser = await prisma.user.create({
        data: {
            name: validate.data.name,
            email: validate.data.email,
            password: hashedPassword,
            role: 'customer' // Securely force customer role
        }
    })

    // Auto login after sign up
    const token = generateSessionToken()
    await createSession(token, newUser.id)
    await setSessionTokenCookie(token, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))

    redirect('/')
}
