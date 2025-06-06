import { z } from "zod"

// User types
export type UserType = "teacher" | "student"

export interface User {
  id: number
  userType: UserType
  firstName: string
  middleName?: string
  lastName: string
  gender: string
  email: string
  department: string
  college: string
  phone?: string
  isActive: boolean
  createdAt: string
}

export interface Teacher extends User {
  employeeId?: string
  qualification?: string
  experienceYears: number
  specialization?: string
}

export interface Student extends User {
  studentId: string
  rollNumber: string
  course: string
  semester?: number
  academicYear?: string
  admissionDate?: string
}

// Form schemas
export const TeacherRegistrationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long"),
    middleName: z.string().max(50, "Middle name too long").optional().or(z.literal("")),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long"),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select a gender",
    }),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    department: z.string().min(2, "Department is required"),
    college: z.string().min(2, "College name is required"),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-$$$$]+$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    qualification: z.string().max(200, "Qualification too long").optional().or(z.literal("")),
    experienceYears: z.number().min(0, "Experience cannot be negative").max(50, "Experience too high").optional(),
    specialization: z.string().max(200, "Specialization too long").optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const StudentRegistrationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long"),
    middleName: z.string().max(50, "Middle name too long").optional().or(z.literal("")),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long"),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select a gender",
    }),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    department: z.string().min(2, "Department is required"),
    college: z.string().min(2, "College name is required"),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-$$$$]+$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    studentId: z.string().min(3, "Student ID must be at least 3 characters").max(20, "Student ID too long"),
    rollNumber: z.string().min(3, "Roll number must be at least 3 characters").max(20, "Roll number too long"),
    course: z.string().min(2, "Course is required"),
    semester: z.number().min(1, "Semester must be at least 1").max(12, "Semester cannot exceed 12").optional(),
    academicYear: z.string().max(20, "Academic year too long").optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const TeacherLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const StudentLoginSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  password: z.string().min(1, "Password is required"),
})

export type FormState =
  | {
      errors?: Record<string, string[]>
      message?: string
      success?: boolean
    }
  | undefined
