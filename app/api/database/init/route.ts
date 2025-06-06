import { NextResponse } from "next/server"
import { testDatabaseConnection, createTablesIfNotExist } from "@/lib/database"

export async function POST() {
  try {
    console.log("Manual database initialization requested...")

    // Test connection first
    await testDatabaseConnection()
    console.log("Database connection successful")

    // Create tables
    await createTablesIfNotExist()
    console.log("Database tables created/verified")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("Manual database initialization failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database initialization failed",
      },
      { status: 500 },
    )
  }
}
