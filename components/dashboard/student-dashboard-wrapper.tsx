"use client"

import { StudentDashboard } from "@/components/assessment/student-dashboard"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StudentDashboardWrapperProps {
  studentId: number
  assessments: any[]
}

export default function StudentDashboardWrapper({ studentId, assessments }: StudentDashboardWrapperProps) {
  const { user, logout } = useAuth()

  const handleStartAssessment = (assessmentId: number) => {
    // TODO: Navigate to assessment taking interface
    console.log("Starting assessment:", assessmentId)
  }

  const handleViewResults = (assessmentId: number) => {
    // TODO: Navigate to results view
    console.log("Viewing results for assessment:", assessmentId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">Oddiant Assessment Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-foreground">
                  {user?.firstName} {user?.lastName}
                </span>
                <Badge variant="secondary">Student</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <StudentDashboard
            studentId={studentId}
            assessments={assessments}
            onStartAssessment={handleStartAssessment}
            onViewResults={handleViewResults}
          />
        </div>
      </main>
    </div>
  )
}
