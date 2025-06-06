"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerTeacher, registerStudent } from "@/actions/auth"
import { useFormValidation } from "@/hooks/use-form-validation"
import { FormField } from "@/components/form-field"
import { TeacherRegistrationSchema, StudentRegistrationSchema } from "@/lib/definitions"
import {
  INDIAN_COLLEGES,
  ACADEMIC_DEPARTMENTS,
  ACADEMIC_COURSES,
  GENDER_OPTIONS,
  ACADEMIC_YEARS,
  SEMESTER_OPTIONS,
  EXPERIENCE_YEARS,
} from "@/lib/data"
import Link from "next/link"

export default function RegistrationForm() {
  const [teacherState, teacherAction, teacherPending] = useActionState(registerTeacher, undefined)
  const [studentState, studentAction, studentPending] = useActionState(registerStudent, undefined)

  // Teacher form validation
  const teacherForm = useFormValidation({
    schema: TeacherRegistrationSchema,
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      college: "",
      phone: "",
      qualification: "",
      experienceYears: 0,
      specialization: "",
    },
  })

  // Student form validation
  const studentForm = useFormValidation({
    schema: StudentRegistrationSchema,
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      college: "",
      phone: "",
      studentId: "",
      rollNumber: "",
      course: "",
      semester: 1,
      academicYear: "",
    },
  })

  const collegeOptions = INDIAN_COLLEGES.map((college) => ({
    value: college,
    label: college,
  }))

  const departmentOptions = ACADEMIC_DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
  }))

  const courseOptions = ACADEMIC_COURSES.map((course) => ({
    value: course,
    label: course,
  }))

  const academicYearOptions = ACADEMIC_YEARS.map((year) => ({
    value: year,
    label: year,
  }))

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Register as a teacher or student to access the Oddiant Assessment Portal</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="teacher" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="teacher">Teacher Registration</TabsTrigger>
            <TabsTrigger value="student">Student Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="teacher">
            <form action={teacherAction} className="space-y-6">
              {teacherState?.message && (
                <Alert variant={teacherState.success ? "default" : "destructive"}>
                  <AlertDescription>{teacherState.message}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    placeholder="Enter first name"
                    required
                    {...teacherForm.getFieldProps("firstName")}
                  />
                  <FormField
                    label="Middle Name"
                    name="middleName"
                    placeholder="Enter middle name"
                    {...teacherForm.getFieldProps("middleName")}
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter last name"
                    required
                    {...teacherForm.getFieldProps("lastName")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Gender"
                    name="gender"
                    options={GENDER_OPTIONS}
                    required
                    {...teacherForm.getFieldProps("gender")}
                  />
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    {...teacherForm.getFieldProps("phone")}
                  />
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  required
                  {...teacherForm.getFieldProps("email")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create password"
                    required
                    {...teacherForm.getFieldProps("password")}
                  />
                  <FormField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    required
                    {...teacherForm.getFieldProps("confirmPassword")}
                  />
                </div>
              </div>

              {/* Institutional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Institutional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Department"
                    name="department"
                    options={departmentOptions}
                    required
                    {...teacherForm.getFieldProps("department")}
                  />
                  <FormField
                    label="College"
                    name="college"
                    options={collegeOptions}
                    required
                    {...teacherForm.getFieldProps("college")}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Qualification"
                    name="qualification"
                    placeholder="Highest qualification"
                    {...teacherForm.getFieldProps("qualification")}
                  />
                  <FormField
                    label="Experience"
                    name="experienceYears"
                    options={EXPERIENCE_YEARS}
                    {...teacherForm.getFieldProps("experienceYears")}
                  />
                </div>

                <FormField
                  label="Specialization"
                  name="specialization"
                  placeholder="Area of specialization"
                  {...teacherForm.getFieldProps("specialization")}
                />
              </div>

              <Button type="submit" className="w-full" disabled={teacherPending}>
                {teacherPending ? "Creating Account..." : "Register as Teacher"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="student">
            <form action={studentAction} className="space-y-6">
              {studentState?.message && (
                <Alert variant={studentState.success ? "default" : "destructive"}>
                  <AlertDescription>{studentState.message}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    placeholder="Enter first name"
                    required
                    {...studentForm.getFieldProps("firstName")}
                  />
                  <FormField
                    label="Middle Name"
                    name="middleName"
                    placeholder="Enter middle name"
                    {...studentForm.getFieldProps("middleName")}
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter last name"
                    required
                    {...studentForm.getFieldProps("lastName")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Gender"
                    name="gender"
                    options={GENDER_OPTIONS}
                    required
                    {...studentForm.getFieldProps("gender")}
                  />
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    {...studentForm.getFieldProps("phone")}
                  />
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  required
                  {...studentForm.getFieldProps("email")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create password"
                    required
                    {...studentForm.getFieldProps("password")}
                  />
                  <FormField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    required
                    {...studentForm.getFieldProps("confirmPassword")}
                  />
                </div>
              </div>

              {/* Institutional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Institutional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Department"
                    name="department"
                    options={departmentOptions}
                    required
                    {...studentForm.getFieldProps("department")}
                  />
                  <FormField
                    label="College"
                    name="college"
                    options={collegeOptions}
                    required
                    {...studentForm.getFieldProps("college")}
                  />
                </div>
              </div>

              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Student ID"
                    name="studentId"
                    placeholder="Enter student ID"
                    required
                    {...studentForm.getFieldProps("studentId")}
                  />
                  <FormField
                    label="Roll Number"
                    name="rollNumber"
                    placeholder="Enter roll number"
                    required
                    {...studentForm.getFieldProps("rollNumber")}
                  />
                </div>

                <FormField
                  label="Course"
                  name="course"
                  options={courseOptions}
                  required
                  {...studentForm.getFieldProps("course")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Semester"
                    name="semester"
                    options={SEMESTER_OPTIONS}
                    {...studentForm.getFieldProps("semester")}
                  />
                  <FormField
                    label="Academic Year"
                    name="academicYear"
                    options={academicYearOptions}
                    {...studentForm.getFieldProps("academicYear")}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={studentPending}>
                {studentPending ? "Creating Account..." : "Register as Student"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
