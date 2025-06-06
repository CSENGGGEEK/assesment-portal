"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, BookOpen, TrendingUp, Calendar, Play, CheckCircle, AlertTriangle, Eye, Award } from "lucide-react"
import type { StudentAssessment } from "@/lib/assessment-definitions"

interface StudentDashboardProps {
  studentId: number
  assessments: StudentAssessment[]
  onStartAssessment: (assessmentId: number) => void
  onViewResults: (assessmentId: number) => void
}

export function StudentDashboard({ studentId, assessments, onStartAssessment, onViewResults }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingAssessments = assessments.filter((a) => a.status === "enrolled")
  const activeAssessments = assessments.filter((a) => a.status === "started")
  const completedAssessments = assessments.filter((a) => a.status === "submitted" || a.status === "evaluated")

  const getOverallStats = () => {
    const completed = completedAssessments.length
    const totalScore = completedAssessments.reduce((sum, a) => sum + a.totalScore, 0)
    const averageScore = completed > 0 ? totalScore / completed : 0
    const averagePercentage = completedAssessments.reduce((sum, a) => sum + a.percentage, 0) / (completed || 1)

    return {
      totalAssessments: assessments.length,
      completed,
      averageScore: Math.round(averageScore * 100) / 100,
      averagePercentage: Math.round(averagePercentage * 100) / 100,
      pending: upcomingAssessments.length + activeAssessments.length,
    }
  }

  const stats = getOverallStats()

  const getStatusBadge = (status: string) => {
    const variants = {
      enrolled: "secondary",
      started: "default",
      submitted: "outline",
      evaluated: "default",
    } as const

    const labels = {
      enrolled: "Not Started",
      started: "In Progress",
      submitted: "Submitted",
      evaluated: "Completed",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Track your assessments and academic progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssessments}</div>
            <p className="text-xs text-muted-foreground">{stats.pending} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalAssessments > 0 ? Math.round((stats.completed / stats.totalAssessments) * 100) : 0}%
              completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePercentage}%</div>
            <p className="text-xs text-muted-foreground">{stats.averageScore} points average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(stats.averagePercentage)}`}>
              {stats.averagePercentage >= 80
                ? "Excellent"
                : stats.averagePercentage >= 60
                  ? "Good"
                  : "Needs Improvement"}
            </div>
            <Progress value={stats.averagePercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Assessment Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingAssessments.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeAssessments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAssessments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAssessments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No upcoming assessments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingAssessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                        <CardDescription>{assessment.description}</CardDescription>
                      </div>
                      {getStatusBadge(assessment.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDuration(assessment.durationMinutes)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>
                              {assessment.teacherFirstName} {assessment.teacherLastName}
                            </span>
                          </div>
                        </div>
                        {assessment.startTime && (
                          <p className="text-sm">
                            <strong>Start:</strong> {new Date(assessment.startTime).toLocaleString()}
                          </p>
                        )}
                        {assessment.endTime && (
                          <p className="text-sm">
                            <strong>End:</strong> {new Date(assessment.endTime).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Button onClick={() => onStartAssessment(assessment.assessmentId)}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeAssessments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No active assessments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeAssessments.map((assessment) => (
                <Card key={assessment.id} className="border-orange-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                        <CardDescription>{assessment.description}</CardDescription>
                      </div>
                      {getStatusBadge(assessment.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Assessment in progress. Time spent: {formatDuration(assessment.timeSpentMinutes)}
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDuration(assessment.durationMinutes)} total</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>
                              {assessment.teacherFirstName} {assessment.teacherLastName}
                            </span>
                          </div>
                        </div>

                        {/* Monitoring alerts */}
                        {(assessment.faceDetectionViolations > 0 ||
                          assessment.tabSwitchCount > 0 ||
                          assessment.copyPasteAttempts > 0) && (
                          <div className="flex items-center gap-2 text-sm text-orange-600">
                            <Eye className="h-4 w-4" />
                            <span>
                              Monitoring: {assessment.faceDetectionViolations} face violations,
                              {assessment.tabSwitchCount} tab switches,
                              {assessment.copyPasteAttempts} copy attempts
                            </span>
                          </div>
                        )}
                      </div>
                      <Button onClick={() => onStartAssessment(assessment.assessmentId)}>Continue Assessment</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAssessments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No completed assessments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedAssessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                        <CardDescription>{assessment.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(assessment.status)}
                        <Badge variant="outline" className={getPerformanceColor(assessment.percentage)}>
                          {assessment.percentage}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Completed in {formatDuration(assessment.timeSpentMinutes)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>
                              {assessment.teacherFirstName} {assessment.teacherLastName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span>
                            Score: <strong>{assessment.totalScore} points</strong>
                          </span>
                          <span>
                            Percentage:{" "}
                            <strong className={getPerformanceColor(assessment.percentage)}>
                              {assessment.percentage}%
                            </strong>
                          </span>
                        </div>

                        {assessment.submittedAt && (
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(assessment.submittedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" onClick={() => onViewResults(assessment.assessmentId)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
