"use client"

import { useActionState } from "react"
import { customerSignIn } from "../lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useFormStatus } from "react-dom"

function SubmitHandler() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Signing in..." : "Sign In"}
        </Button>
    )
}

export function SignInForm({ onToggle }: { onToggle: () => void }) {
    const [state, formAction] = useActionState(customerSignIn, { error: "" })

    return (
        <form action={formAction} className="p-6 md:p-8" suppressHydrationWarning={true}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-balance">
                        Login to your customer account
                    </p>
                </div>

                {state.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}

                <Field>
                    <FieldLabel htmlFor="signInEmail">Email</FieldLabel>
                    <Input name="email" id="signInEmail" type="email" placeholder="m@example.com" required />
                </Field>

                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="signInPassword">Password</FieldLabel>
                        <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline hover:text-primary">
                            Forgot password?
                        </a>
                    </div>
                    <Input name="password" id="signInPassword" type="password" required />
                </Field>

                <Field>
                    <SubmitHandler />
                </Field>

                <FieldDescription className="text-center mt-2">
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={onToggle} className="font-semibold text-primary underline-offset-4 hover:underline focus:outline-none">
                        Sign up
                    </button>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}
