"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BookOpen, Users, Clock, Eye, Edit, Settings } from "lucide-react"
import { AssessmentCreator } from "@/components/assessment/assessment-creator"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

interface TeacherDashboardProps {
  teacherId: number
  assessments: any[]
}

export default function TeacherDashboard({ teacherId, assessments }: TeacherDashboardProps) {
  const [showCreator, setShowCreator] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const { user, logout } = useAuth()

  const draftAssessments = assessments.filter((a) => !a.is_published)
  const publishedAssessments = assessments.filter((a) => a.is_published)
  const activeAssessments = assessments.filter(
    (a) => a.is_published && (!a.end_time || new Date(a.end_time) > new Date()),
  )

  const handleCreateAssessment = (assessmentData: any) => {
    console.log("Creating assessment:", assessmentData)
    // TODO: Implement assessment creation
    setShowCreator(false)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (showCreator) {
    return <AssessmentCreator onSave={handleCreateAssessment} onCancel={() => setShowCreator(false)} />
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
                <Badge variant="default">Teacher</Badge>
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
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, {user?.firstName}!</h2>
              <p className="text-muted-foreground">Manage your assessments and track student progress.</p>
            </div>
            <Button onClick={() => setShowCreator(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assessments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {draftAssessments.length} drafts, {publishedAssessments.length} published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Assessments</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeAssessments.length}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assessments.reduce((sum, a) => sum + (a.enrolled_students || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all assessments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assessments.reduce((sum, a) => sum + (a.submitted_count || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">Pending review</p>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Assessments ({assessments.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftAssessments.length})</TabsTrigger>
              <TabsTrigger value="published">Published ({publishedAssessments.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeAssessments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {assessments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No assessments yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first assessment to get started</p>
                    <Button onClick={() => setShowCreator(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assessment
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {assessments.map((assessment) => (
                    <Card key={assessment.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{assessment.title}</CardTitle>
                            <CardDescription>{assessment.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={assessment.is_published ? "default" : "secondary"}>
                              {assessment.is_published ? "Published" : "Draft"}
                            </Badge>
                            {assessment.face_detection_enabled && <Badge variant="outline">Face Detection</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDuration(assessment.duration_minutes)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{assessment.enrolled_students || 0} students</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{assessment.submitted_count || 0} submissions</span>
                              </div>
                            </div>
                            {assessment.start_time && (
                              <p className="text-sm">
                                <strong>Start:</strong> {new Date(assessment.start_time).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-2" />
                              Settings
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts">
              <div className="grid gap-4">
                {draftAssessments.map((assessment) => (
                  <Card key={assessment.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{assessment.title}</CardTitle>
                          <CardDescription>{assessment.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">Draft</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Created: {new Date(assessment.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Continue Editing
                          </Button>
                          <Button size="sm">Publish</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="published">
              <div className="grid gap-4">
                {publishedAssessments.map((assessment) => (
                  <Card key={assessment.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{assessment.title}</CardTitle>
                          <CardDescription>{assessment.description}</CardDescription>
                        </div>
                        <Badge variant="default">Published</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{assessment.enrolled_students || 0} enrolled</span>
                            <span>{assessment.submitted_count || 0} submitted</span>
                          </div>
                          {assessment.start_time && (
                            <p className="text-sm">Start: {new Date(assessment.start_time).toLocaleString()}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            Monitor
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Results
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="grid gap-4">
                {activeAssessments.map((assessment) => (
                  <Card key={assessment.id} className="border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{assessment.title}</CardTitle>
                          <CardDescription>{assessment.description}</CardDescription>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{assessment.enrolled_students || 0} students taking</span>
                            <span>{assessment.submitted_count || 0} completed</span>
                          </div>
                          {assessment.end_time && (
                            <p className="text-sm">Ends: {new Date(assessment.end_time).toLocaleString()}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Live Monitor
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
