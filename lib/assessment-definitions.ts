import { z } from "zod"

// Assessment types
export type AssessmentStatus = "draft" | "published" | "active" | "completed" | "archived"
export type SectionType = "mcq" | "msq" | "subjective" | "coding"
export type QuestionType = "mcq" | "msq" | "subjective" | "coding"
export type DifficultyLevel = "easy" | "medium" | "hard"
export type ProgrammingLanguage = "javascript" | "python" | "java" | "cpp" | "c"

export interface Assessment {
  id: number
  title: string
  description?: string
  teacherId: number
  totalMarks: number
  durationMinutes: number
  startTime?: string
  endTime?: string
  isPublished: boolean
  allowLateSubmission: boolean
  randomizeQuestions: boolean
  showResultsImmediately: boolean
  faceDetectionEnabled: boolean
  screenRecordingEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface AssessmentSection {
  id: number
  assessmentId: number
  title: string
  description?: string
  sectionType: SectionType
  timeLimitMinutes?: number
  marksPerQuestion: number
  negativeMarking: number
  sectionOrder: number
  questions?: Question[]
}

export interface Question {
  id: number
  sectionId: number
  questionText: string
  questionType: QuestionType
  marks: number
  difficultyLevel: DifficultyLevel
  questionOrder: number

  // For coding questions
  programmingLanguage?: ProgrammingLanguage
  starterCode?: string
  testCases?: TestCase[]
  timeLimitSeconds?: number
  memoryLimitMb?: number

  // For MCQ/MSQ questions
  options?: string[]
  correctAnswers?: number[]

  // For subjective questions
  maxWords?: number
  sampleAnswer?: string
}

export interface TestCase {
  input: string
  expectedOutput: string
  isHidden: boolean
  points: number
}

export interface StudentAssessment {
  id: number
  assessmentId: number
  studentId: number
  enrolledAt: string
  startedAt?: string
  submittedAt?: string
  timeSpentMinutes: number
  status: "enrolled" | "started" | "submitted" | "evaluated"
  totalScore: number
  percentage: number
  faceDetectionViolations: number
  tabSwitchCount: number
  copyPasteAttempts: number
  suspiciousActivityLog?: any[]
}

// Validation schemas
export const AssessmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  durationMinutes: z.number().min(5, "Duration must be at least 5 minutes").max(480, "Duration cannot exceed 8 hours"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  allowLateSubmission: z.boolean().default(false),
  randomizeQuestions: z.boolean().default(false),
  showResultsImmediately: z.boolean().default(false),
  faceDetectionEnabled: z.boolean().default(true),
  screenRecordingEnabled: z.boolean().default(true),
})

export const SectionSchema = z.object({
  title: z.string().min(2, "Section title must be at least 2 characters"),
  description: z.string().optional(),
  sectionType: z.enum(["mcq", "msq", "subjective", "coding"]),
  timeLimitMinutes: z.number().min(1).max(120).optional(),
  marksPerQuestion: z.number().min(1, "Marks per question must be at least 1"),
  negativeMarking: z.number().min(0).max(1, "Negative marking must be between 0 and 1"),
})

export const MCQQuestionSchema = z.object({
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  marks: z.number().min(1, "Marks must be at least 1"),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options required")
    .max(6, "Maximum 6 options allowed"),
  correctAnswers: z.array(z.number()).min(1, "At least one correct answer required"),
})

export const SubjectiveQuestionSchema = z.object({
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  marks: z.number().min(1, "Marks must be at least 1"),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  maxWords: z.number().min(10, "Minimum 10 words required").max(1000, "Maximum 1000 words allowed").optional(),
  sampleAnswer: z.string().optional(),
})

export const CodingQuestionSchema = z.object({
  questionText: z.string().min(20, "Coding question must be at least 20 characters"),
  marks: z.number().min(1, "Marks must be at least 1"),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  programmingLanguage: z.enum(["javascript", "python", "java", "cpp", "c"]),
  starterCode: z.string().optional(),
  timeLimitSeconds: z.number().min(30, "Minimum 30 seconds").max(600, "Maximum 10 minutes"),
  memoryLimitMb: z.number().min(32, "Minimum 32MB").max(512, "Maximum 512MB"),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        isHidden: z.boolean().default(false),
        points: z.number().min(1),
      }),
    )
    .min(1, "At least one test case required"),
})

export type FormState =
  | {
      errors?: Record<string, string[]>
      message?: string
      success?: boolean
    }
  | undefined
