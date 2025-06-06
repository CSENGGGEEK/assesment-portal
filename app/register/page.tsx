import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import RegistrationForm from "@/components/registration-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { DatabaseStatus } from "@/components/database-status"

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-foreground">Create Your Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the Oddiant Assessment Portal as a teacher or student
          </p>
        </div>

        {/* Add database status check */}
        <div className="mb-6">
          <DatabaseStatus />
        </div>

        <RegistrationForm />
      </div>
    </div>
  )
}
