"use server"

import {
  TeacherRegistrationSchema,
  StudentRegistrationSchema,
  TeacherLoginSchema,
  StudentLoginSchema,
  type FormState,
} from "@/lib/definitions"
import {
  createUser,
  createTeacher,
  createStudent,
  findUserByEmail,
  findStudentByStudentId,
  checkEmailExists,
  checkStudentIdExists,
  createTablesIfNotExist,
} from "@/lib/database"
import { hashPassword, verifyPassword, createUserSession } from "@/lib/auth"
import { redirect } from "next/navigation"

async function ensureDatabaseReady() {
  try {
    const success = await createTablesIfNotExist()
    if (!success) {
      throw new Error("Database tables could not be created")
    }
  } catch (error) {
    console.error("Database initialization error:", error)
    throw new Error("Database is not ready. Please try again.")
  }
}

export async function registerTeacher(state: FormState, formData: FormData): Promise<FormState> {
  try {
    await ensureDatabaseReady()
  } catch (error) {
    return {
      message: "Database connection error. Please try again later.",
    }
  }

  const validatedFields = TeacherRegistrationSchema.safeParse({
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName") || undefined,
    lastName: formData.get("lastName"),
    gender: formData.get("gender"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    department: formData.get("department"),
    college: formData.get("college"),
    phone: formData.get("phone") || undefined,
    qualification: formData.get("qualification") || undefined,
    experienceYears: formData.get("experienceYears") ? Number(formData.get("experienceYears")) : undefined,
    specialization: formData.get("specialization") || undefined,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    }
  }

  const { confirmPassword, ...data } = validatedFields.data

  try {
    // Check if email already exists
    const emailExists = await checkEmailExists(data.email)
    if (emailExists) {
      return {
        errors: { email: ["Email already exists"] },
        message: "Registration failed.",
      }
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user
    const user = await createUser({
      userType: "teacher",
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      gender: data.gender,
      email: data.email,
      passwordHash,
      department: data.department,
      college: data.college,
      phone: data.phone,
    })

    // Create teacher record
    await createTeacher(user.id, {
      qualification: data.qualification,
      experienceYears: data.experienceYears,
      specialization: data.specialization,
    })

    // Create session
    await createUserSession(user.id)
  } catch (error) {
    console.error("Registration error:", error)
    return {
      message: "Registration failed. Please try again.",
    }
  }

  redirect("/dashboard")
}

export async function registerStudent(state: FormState, formData: FormData): Promise<FormState> {
  try {
    await ensureDatabaseReady()
  } catch (error) {
    return {
      message: "Database connection error. Please try again later.",
    }
  }

  const validatedFields = StudentRegistrationSchema.safeParse({
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName") || undefined,
    lastName: formData.get("lastName"),
    gender: formData.get("gender"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    department: formData.get("department"),
    college: formData.get("college"),
    phone: formData.get("phone") || undefined,
    studentId: formData.get("studentId"),
    rollNumber: formData.get("rollNumber"),
    course: formData.get("course"),
    semester: formData.get("semester") ? Number(formData.get("semester")) : undefined,
    academicYear: formData.get("academicYear") || undefined,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    }
  }

  const { confirmPassword, ...data } = validatedFields.data

  try {
    // Check if email already exists
    const emailExists = await checkEmailExists(data.email)
    if (emailExists) {
      return {
        errors: { email: ["Email already exists"] },
        message: "Registration failed.",
      }
    }

    // Check if student ID already exists
    const studentIdExists = await checkStudentIdExists(data.studentId)
    if (studentIdExists) {
      return {
        errors: { studentId: ["Student ID already exists"] },
        message: "Registration failed.",
      }
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user
    const user = await createUser({
      userType: "student",
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      gender: data.gender,
      email: data.email,
      passwordHash,
      department: data.department,
      college: data.college,
      phone: data.phone,
    })

    // Create student record
    await createStudent(user.id, {
      studentId: data.studentId,
      rollNumber: data.rollNumber,
      course: data.course,
      semester: data.semester,
      academicYear: data.academicYear,
    })

    // Create session
    await createUserSession(user.id)
  } catch (error) {
    console.error("Registration error:", error)
    return {
      message: "Registration failed. Please try again.",
    }
  }

  redirect("/dashboard")
}

export async function loginTeacher(state: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = TeacherLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    }
  }

  const { email, password } = validatedFields.data

  try {
    const user = await findUserByEmail(email)

    if (!user || user.user_type !== "teacher") {
      return {
        message: "Invalid email or password.",
      }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return {
        message: "Invalid email or password.",
      }
    }

    await createUserSession(user.id)
  } catch (error) {
    console.error("Login error:", error)
    return {
      message: "Login failed. Please try again.",
    }
  }

  redirect("/dashboard")
}

export async function loginStudent(state: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = StudentLoginSchema.safeParse({
    studentId: formData.get("studentId"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    }
  }

  const { studentId, password } = validatedFields.data

  try {
    const user = await findStudentByStudentId(studentId)

    if (!user) {
      return {
        message: "Invalid student ID or password.",
      }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return {
        message: "Invalid student ID or password.",
      }
    }

    await createUserSession(user.id)
  } catch (error) {
    console.error("Login error:", error)
    return {
      message: "Login failed. Please try again.",
    }
  }

  redirect("/dashboard")
}
