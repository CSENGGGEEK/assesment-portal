import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { DatabaseStatus } from "@/components/database-status"

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to Oddiant Assessment Portal
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">Access your account as a teacher or student</p>
        </div>

        {/* Add database status check */}
        <div className="mb-6">
          <DatabaseStatus />
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
