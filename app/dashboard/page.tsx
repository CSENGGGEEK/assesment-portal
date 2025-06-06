import { requireAuth } from "@/lib/auth"
import TeacherDashboard from "@/components/dashboard/teacher-dashboard"
import StudentDashboardWrapper from "@/components/dashboard/student-dashboard-wrapper"

export default async function DashboardPage() {
  const session = await requireAuth()

  if (session.user_type === "teacher") {
    // For now, pass empty assessments array until we implement the database queries
    const assessments: any[] = []
    return <TeacherDashboard teacherId={session.user_id} assessments={assessments} />
  } else {
    // For now, pass empty assessments array until we implement the database queries
    const assessments: any[] = []
    return <StudentDashboardWrapper studentId={session.user_id} assessments={assessments} />
  }
}
