import { LoginForm } from "@/app/(admin)/dashboard/(auth)/sign-in/_components/login-form"
import { ModeToggle } from "@/components/mode-toggle"
import { getCurrentSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const { session } = await getCurrentSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative">
      <div className="absolute top-4 right-4 md:top-8 md:right-8 animate-in fade-in duration-2000 ease-in-out">
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-sm md:max-w-3xl flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-2000 ease-in-out">
        <LoginForm />
      </div>
    </div>
  )
}
