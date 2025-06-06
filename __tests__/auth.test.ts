import { describe, it, expect } from "@jest/globals"
import { hashPassword, verifyPassword, generateSessionToken } from "@/lib/auth"
import {
  TeacherRegistrationSchema,
  StudentRegistrationSchema,
  TeacherLoginSchema,
  StudentLoginSchema,
} from "@/lib/definitions"

describe("Authentication Functions", () => {
  describe("Password Hashing", () => {
    it("should hash password correctly", async () => {
      const password = "TestPassword123!"
      const hashedPassword = await hashPassword(password)

      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.length).toBeGreaterThan(50)
    })

    it("should verify password correctly", async () => {
      const password = "TestPassword123!"
      const hashedPassword = await hashPassword(password)

      const isValid = await verifyPassword(password, hashedPassword)
      expect(isValid).toBe(true)

      const isInvalid = await verifyPassword("WrongPassword", hashedPassword)
      expect(isInvalid).toBe(false)
    })
  })

  describe("Session Token Generation", () => {
    it("should generate unique session tokens", () => {
      const token1 = generateSessionToken()
      const token2 = generateSessionToken()

      expect(token1).toBeDefined()
      expect(token2).toBeDefined()
      expect(token1).not.toBe(token2)
      expect(token1.length).toBeGreaterThan(30)
    })
  })
})

describe("Form Validation Schemas", () => {
  describe("Teacher Registration Schema", () => {
    it("should validate correct teacher data", () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        email: "john.doe@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        department: "Computer Science",
        college: "Test University",
        phone: "+91-9876543210",
        qualification: "PhD",
        experienceYears: 5,
        specialization: "Machine Learning",
      }

      const result = TeacherRegistrationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("should reject invalid email", () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        email: "invalid-email",
        password: "Password123!",
        confirmPassword: "Password123!",
        department: "Computer Science",
        college: "Test University",
      }

      const result = TeacherRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("email"))).toBe(true)
      }
    })

    it("should reject weak password", () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        email: "john.doe@example.com",
        password: "weak",
        confirmPassword: "weak",
        department: "Computer Science",
        college: "Test University",
      }

      const result = TeacherRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("password"))).toBe(true)
      }
    })

    it("should reject mismatched passwords", () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        email: "john.doe@example.com",
        password: "Password123!",
        confirmPassword: "DifferentPassword123!",
        department: "Computer Science",
        college: "Test University",
      }

      const result = TeacherRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("confirmPassword"))).toBe(true)
      }
    })
  })

  describe("Student Registration Schema", () => {
    it("should validate correct student data", () => {
      const validData = {
        firstName: "Jane",
        lastName: "Smith",
        gender: "female",
        email: "jane.smith@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        department: "Computer Science",
        college: "Test University",
        studentId: "STU001",
        rollNumber: "CS2024001",
        course: "B.Tech Computer Science",
        semester: 3,
        academicYear: "2024-2025",
      }

      const result = StudentRegistrationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("should reject missing student ID", () => {
      const invalidData = {
        firstName: "Jane",
        lastName: "Smith",
        gender: "female",
        email: "jane.smith@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        department: "Computer Science",
        college: "Test University",
        rollNumber: "CS2024001",
        course: "B.Tech Computer Science",
      }

      const result = StudentRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("studentId"))).toBe(true)
      }
    })
  })

  describe("Login Schemas", () => {
    it("should validate teacher login data", () => {
      const validData = {
        email: "teacher@example.com",
        password: "password123",
      }

      const result = TeacherLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("should validate student login data", () => {
      const validData = {
        studentId: "STU001",
        password: "password123",
      }

      const result = StudentLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("should reject invalid teacher login email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      }

      const result = TeacherLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject empty student ID", () => {
      const invalidData = {
        studentId: "",
        password: "password123",
      }

      const result = StudentLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
