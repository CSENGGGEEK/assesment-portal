import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Add connection testing with better error handling
export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Improved table creation with better error handling
export async function createTablesIfNotExist() {
  try {
    console.log("Creating database tables if they don't exist...")

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('teacher', 'student')),
        first_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        last_name VARCHAR(100) NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        college VARCHAR(200) NOT NULL,
        phone VARCHAR(15),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create teachers table
    await sql`
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        employee_id VARCHAR(50) UNIQUE,
        qualification VARCHAR(200),
        experience_years INTEGER DEFAULT 0,
        specialization VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create students table
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        student_id VARCHAR(50) UNIQUE NOT NULL,
        roll_number VARCHAR(50) UNIQUE NOT NULL,
        course VARCHAR(100) NOT NULL,
        semester INTEGER,
        academic_year VARCHAR(20),
        admission_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number)`
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token)`
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`

    console.log("Database tables created successfully")
    return true
  } catch (error) {
    console.error("Failed to create database tables:", error)
    return false
  }
}

// Database helper functions with better error handling
export async function createUser(userData: {
  userType: "teacher" | "student"
  firstName: string
  middleName?: string
  lastName: string
  gender: string
  email: string
  passwordHash: string
  department: string
  college: string
  phone?: string
}) {
  try {
    const result = await sql`
      INSERT INTO users (
        user_type, first_name, middle_name, last_name, gender, 
        email, password_hash, department, college, phone
      )
      VALUES (
        ${userData.userType}, ${userData.firstName}, ${userData.middleName || null},
        ${userData.lastName}, ${userData.gender}, ${userData.email},
        ${userData.passwordHash}, ${userData.department}, ${userData.college},
        ${userData.phone || null}
      )
      RETURNING id, user_type, first_name, middle_name, last_name, gender, 
               email, department, college, phone, is_active, created_at
    `
    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function createTeacher(
  userId: number,
  teacherData: {
    employeeId?: string
    qualification?: string
    experienceYears?: number
    specialization?: string
  },
) {
  try {
    const result = await sql`
      INSERT INTO teachers (user_id, employee_id, qualification, experience_years, specialization)
      VALUES (${userId}, ${teacherData.employeeId || null}, ${teacherData.qualification || null},
              ${teacherData.experienceYears || 0}, ${teacherData.specialization || null})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating teacher:", error)
    throw error
  }
}

export async function createStudent(
  userId: number,
  studentData: {
    studentId: string
    rollNumber: string
    course: string
    semester?: number
    academicYear?: string
  },
) {
  try {
    const result = await sql`
      INSERT INTO students (user_id, student_id, roll_number, course, semester, academic_year)
      VALUES (${userId}, ${studentData.studentId}, ${studentData.rollNumber},
              ${studentData.course}, ${studentData.semester || null}, ${studentData.academicYear || null})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating student:", error)
    throw error
  }
}

export async function findUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT u.*, t.employee_id, t.qualification, t.experience_years, t.specialization
      FROM users u
      LEFT JOIN teachers t ON u.id = t.user_id
      WHERE u.email = ${email} AND u.is_active = true
    `
    return result[0] || null
  } catch (error) {
    console.error("Error finding user by email:", error)
    throw error
  }
}

export async function findStudentByStudentId(studentId: string) {
  try {
    const result = await sql`
      SELECT u.*, s.student_id, s.roll_number, s.course, s.semester, s.academic_year
      FROM users u
      INNER JOIN students s ON u.id = s.user_id
      WHERE s.student_id = ${studentId} AND u.is_active = true
    `
    return result[0] || null
  } catch (error) {
    console.error("Error finding student by student ID:", error)
    throw error
  }
}

export async function createSession(userId: number, sessionToken: string, expiresAt: Date) {
  try {
    const result = await sql`
      INSERT INTO sessions (user_id, session_token, expires_at)
      VALUES (${userId}, ${sessionToken}, ${expiresAt.toISOString()})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

export async function findSessionByToken(sessionToken: string) {
  try {
    const result = await sql`
      SELECT s.*, u.user_type, u.first_name, u.middle_name, u.last_name, 
             u.email, u.department, u.college
      FROM sessions s
      INNER JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ${sessionToken} 
      AND s.expires_at > NOW()
      AND u.is_active = true
    `
    return result[0] || null
  } catch (error) {
    console.error("Error finding session by token:", error)
    return null
  }
}

export async function deleteSession(sessionToken: string) {
  try {
    await sql`DELETE FROM sessions WHERE session_token = ${sessionToken}`
  } catch (error) {
    console.error("Error deleting session:", error)
    throw error
  }
}

export async function checkEmailExists(email: string) {
  try {
    const result = await sql`SELECT id FROM users WHERE email = ${email}`
    return result.length > 0
  } catch (error) {
    console.error("Error checking email exists:", error)
    throw error
  }
}

export async function checkStudentIdExists(studentId: string) {
  try {
    const result = await sql`SELECT id FROM students WHERE student_id = ${studentId}`
    return result.length > 0
  } catch (error) {
    console.error("Error checking student ID exists:", error)
    throw error
  }
}
