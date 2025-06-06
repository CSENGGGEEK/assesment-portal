"use client"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginTeacher, loginStudent } from "@/actions/auth"
import { useFormValidation } from "@/hooks/use-form-validation"
import { FormField } from "@/components/form-field"
import { TeacherLoginSchema, StudentLoginSchema } from "@/lib/definitions"
import Link from "next/link"

export default function LoginForm() {
  const [teacherState, teacherAction, teacherPending] = useActionState(loginTeacher, undefined)
  const [studentState, studentAction, studentPending] = useActionState(loginStudent, undefined)

  // Teacher login validation
  const teacherForm = useFormValidation({
    schema: TeacherLoginSchema,
    initialValues: {
      email: "",
      password: "",
    },
  })

  // Student login validation
  const studentForm = useFormValidation({
    schema: StudentLoginSchema,
    initialValues: {
      studentId: "",
      password: "",
    },
  })

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Choose your account type and enter your credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="teacher" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
            <TabsTrigger value="student">Student</TabsTrigger>
          </TabsList>

          <TabsContent value="teacher">
            <form action={teacherAction} className="space-y-4">
              {teacherState?.message && (
                <Alert variant="destructive">
                  <AlertDescription>{teacherState.message}</AlertDescription>
                </Alert>
              )}

              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                {...teacherForm.getFieldProps("email")}
              />

              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                {...teacherForm.getFieldProps("password")}
              />

              <Button type="submit" className="w-full" disabled={teacherPending}>
                {teacherPending ? "Signing in..." : "Sign In as Teacher"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="student">
            <form action={studentAction} className="space-y-4">
              {studentState?.message && (
                <Alert variant="destructive">
                  <AlertDescription>{studentState.message}</AlertDescription>
                </Alert>
              )}

              <FormField
                label="Student ID"
                name="studentId"
                placeholder="Enter your student ID"
                required
                {...studentForm.getFieldProps("studentId")}
              />

              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                {...studentForm.getFieldProps("password")}
              />

              <Button type="submit" className="w-full" disabled={studentPending}>
                {studentPending ? "Signing in..." : "Sign In as Student"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
