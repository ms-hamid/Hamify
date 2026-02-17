"use server"

import { redirect } from "next/navigation"
import { ActionResult } from "@/types"
import { schemaSignIn } from "@/lib/schema"

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

    redirect('/dashboard/sign-in')
}