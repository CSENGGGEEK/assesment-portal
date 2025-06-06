import { type NextRequest, NextResponse } from "next/server"
import { findSessionByToken } from "@/lib/database"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session token from cookies
  const sessionToken = request.cookies.get("session")?.value

  // Check if user has valid session
  let session = null
  if (sessionToken) {
    try {
      session = await findSessionByToken(sessionToken)
    } catch (error) {
      console.error("Session validation error:", error)
    }
  }

  // Define protected and auth routes
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/profile")

  // Redirect logic
  if (isAuthRoute && session) {
    // User is logged in but trying to access auth pages
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (isProtectedRoute && !session) {
    // User is not logged in but trying to access protected pages
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
