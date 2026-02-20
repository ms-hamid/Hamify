"use client"

import { useActionState } from "react"
import { customerSignUp } from "../lib/actions"
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
            {pending ? "Creating account..." : "Sign Up"}
        </Button>
    )
}

export function SignUpForm({ onToggle }: { onToggle: () => void }) {
    const [state, formAction] = useActionState(customerSignUp, { error: "" })

    return (
        <form action={formAction} className="p-6 md:p-8" suppressHydrationWarning={true}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-muted-foreground text-balance">
                        Enter your information to get started!
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
                    <FieldLabel htmlFor="signUpName">Full Name</FieldLabel>
                    <Input name="name" id="signUpName" type="text" placeholder="John Doe" required />
                </Field>

                <Field>
                    <FieldLabel htmlFor="signUpEmail">Email</FieldLabel>
                    <Input name="email" id="signUpEmail" type="email" placeholder="m@example.com" required />
                </Field>

                <Field>
                    <FieldLabel htmlFor="signUpPassword">Password</FieldLabel>
                    <Input name="password" id="signUpPassword" type="password" placeholder="******" minLength={6} required />
                </Field>

                <Field>
                    <SubmitHandler />
                </Field>

                <FieldDescription className="text-center mt-2">
                    Already have an account?{" "}
                    <button type="button" onClick={onToggle} className="font-semibold text-primary underline-offset-4 hover:underline focus:outline-none">
                        Sign in
                    </button>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}
