import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { getSession } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Oddiant Assessment Portal",
  description: "A comprehensive assessment portal for teachers and students - Powered by Oddiant",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get session without database initialization to prevent blocking
  let session = null
  let user = null

  try {
    session = await getSession()
    user = session
      ? {
          id: session.user_id,
          userType: session.user_type as "teacher" | "student",
          firstName: session.first_name,
          middleName: session.middle_name,
          lastName: session.last_name,
          email: session.email,
          department: session.department,
          college: session.college,
          gender: "",
          phone: "",
          isActive: true,
          createdAt: "",
        }
      : null
  } catch (error) {
    console.error("Session retrieval failed:", error)
    // Continue without session - user will be redirected to login
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider initialUser={user}>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
