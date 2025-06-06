import { NextResponse } from "next/server"
import { testDatabaseConnection, createTablesIfNotExist } from "@/lib/database"

export async function GET() {
  try {
    // Test database connection first
    const connectionSuccess = await testDatabaseConnection()

    if (!connectionSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
        },
        { status: 500 },
      )
    }

    // Try to ensure tables exist
    const tablesSuccess = await createTablesIfNotExist()

    if (!tablesSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Database tables could not be created",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database is ready",
    })
  } catch (error) {
    console.error("Database status check failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 },
    )
  }
}
