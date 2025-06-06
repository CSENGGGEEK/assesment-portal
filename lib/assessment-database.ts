import { sql } from "./database"
import type { Assessment, AssessmentSection, Question } from "./assessment-definitions"

// Assessment CRUD operations
export async function createAssessment(assessmentData: Omit<Assessment, "id" | "createdAt" | "updatedAt">) {
  const result = await sql`
    INSERT INTO assessments (
      title, description, teacher_id, total_marks, duration_minutes,
      start_time, end_time, is_published, allow_late_submission,
      randomize_questions, show_results_immediately, face_detection_enabled,
      screen_recording_enabled
    )
    VALUES (
      ${assessmentData.title}, ${assessmentData.description || null},
      ${assessmentData.teacherId}, ${assessmentData.totalMarks},
      ${assessmentData.durationMinutes}, ${assessmentData.startTime || null},
      ${assessmentData.endTime || null}, ${assessmentData.isPublished},
      ${assessmentData.allowLateSubmission}, ${assessmentData.randomizeQuestions},
      ${assessmentData.showResultsImmediately}, ${assessmentData.faceDetectionEnabled},
      ${assessmentData.screenRecordingEnabled}
    )
    RETURNING *
  `
  return result[0]
}

export async function getAssessmentsByTeacher(teacherId: number) {
  const result = await sql`
    SELECT a.*, 
           COUNT(sa.id) as enrolled_students,
           COUNT(CASE WHEN sa.status = 'submitted' THEN 1 END) as submitted_count
    FROM assessments a
    LEFT JOIN student_assessments sa ON a.id = sa.assessment_id
    WHERE a.teacher_id = ${teacherId}
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `
  return result
}

export async function getAssessmentById(assessmentId: number) {
  const result = await sql`
    SELECT * FROM assessments WHERE id = ${assessmentId}
  `
  return result[0] || null
}

export async function updateAssessment(assessmentId: number, updates: Partial<Assessment>) {
  const setClause = Object.keys(updates)
    .map((key) => `${key} = $${Object.keys(updates).indexOf(key) + 2}`)
    .join(", ")

  const values = [assessmentId, ...Object.values(updates)]

  const result = await sql`
    UPDATE assessments 
    SET ${sql.unsafe(setClause)}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `.apply(null, values)

  return result[0]
}

export async function deleteAssessment(assessmentId: number) {
  await sql`DELETE FROM assessments WHERE id = ${assessmentId}`
}

// Section CRUD operations
export async function createSection(sectionData: Omit<AssessmentSection, "id">) {
  const result = await sql`
    INSERT INTO assessment_sections (
      assessment_id, title, description, section_type,
      time_limit_minutes, marks_per_question, negative_marking, section_order
    )
    VALUES (
      ${sectionData.assessmentId}, ${sectionData.title},
      ${sectionData.description || null}, ${sectionData.sectionType},
      ${sectionData.timeLimitMinutes || null}, ${sectionData.marksPerQuestion},
      ${sectionData.negativeMarking}, ${sectionData.sectionOrder}
    )
    RETURNING *
  `
  return result[0]
}

export async function getSectionsByAssessment(assessmentId: number) {
  const result = await sql`
    SELECT s.*, COUNT(q.id) as question_count
    FROM assessment_sections s
    LEFT JOIN questions q ON s.id = q.section_id
    WHERE s.assessment_id = ${assessmentId}
    GROUP BY s.id
    ORDER BY s.section_order
  `
  return result
}

// Question CRUD operations
export async function createQuestion(questionData: Omit<Question, "id">) {
  const result = await sql`
    INSERT INTO questions (
      section_id, question_text, question_type, marks, difficulty_level,
      question_order, programming_language, starter_code, test_cases,
      time_limit_seconds, memory_limit_mb, options, correct_answers,
      max_words, sample_answer
    )
    VALUES (
      ${questionData.sectionId}, ${questionData.questionText},
      ${questionData.questionType}, ${questionData.marks},
      ${questionData.difficultyLevel}, ${questionData.questionOrder},
      ${questionData.programmingLanguage || null}, ${questionData.starterCode || null},
      ${JSON.stringify(questionData.testCases) || null},
      ${questionData.timeLimitSeconds || null}, ${questionData.memoryLimitMb || null},
      ${JSON.stringify(questionData.options) || null},
      ${JSON.stringify(questionData.correctAnswers) || null},
      ${questionData.maxWords || null}, ${questionData.sampleAnswer || null}
    )
    RETURNING *
  `
  return result[0]
}

export async function getQuestionsBySection(sectionId: number) {
  const result = await sql`
    SELECT * FROM questions 
    WHERE section_id = ${sectionId}
    ORDER BY question_order
  `
  return result
}

// Student assessment operations
export async function enrollStudentInAssessment(assessmentId: number, studentId: number) {
  const result = await sql`
    INSERT INTO student_assessments (assessment_id, student_id)
    VALUES (${assessmentId}, ${studentId})
    ON CONFLICT (assessment_id, student_id) DO NOTHING
    RETURNING *
  `
  return result[0]
}

export async function getStudentAssessments(studentId: number) {
  const result = await sql`
    SELECT sa.*, a.title, a.description, a.duration_minutes, a.start_time, a.end_time,
           u.first_name as teacher_first_name, u.last_name as teacher_last_name
    FROM student_assessments sa
    JOIN assessments a ON sa.assessment_id = a.id
    JOIN users u ON a.teacher_id = u.id
    WHERE sa.student_id = ${studentId}
    ORDER BY a.start_time DESC, sa.enrolled_at DESC
  `
  return result
}

export async function startAssessment(studentAssessmentId: number) {
  const result = await sql`
    UPDATE student_assessments 
    SET status = 'started', started_at = CURRENT_TIMESTAMP
    WHERE id = ${studentAssessmentId} AND status = 'enrolled'
    RETURNING *
  `
  return result[0]
}

export async function submitAssessment(studentAssessmentId: number) {
  const result = await sql`
    UPDATE student_assessments 
    SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP
    WHERE id = ${studentAssessmentId} AND status = 'started'
    RETURNING *
  `
  return result[0]
}

// Monitoring functions
export async function logAssessmentEvent(
  studentAssessmentId: number,
  eventType: string,
  eventData: any,
  ipAddress?: string,
  userAgent?: string,
) {
  await sql`
    INSERT INTO assessment_monitoring (
      student_assessment_id, event_type, event_data, ip_address, user_agent
    )
    VALUES (
      ${studentAssessmentId}, ${eventType}, ${JSON.stringify(eventData)},
      ${ipAddress || null}, ${userAgent || null}
    )
  `
}

export async function updateSuspiciousActivity(
  studentAssessmentId: number,
  activityType: "face_detection" | "tab_switch" | "copy_paste",
  increment = 1,
) {
  const columnMap = {
    face_detection: "face_detection_violations",
    tab_switch: "tab_switch_count",
    copy_paste: "copy_paste_attempts",
  }

  const column = columnMap[activityType]

  await sql`
    UPDATE student_assessments 
    SET ${sql.unsafe(column)} = ${sql.unsafe(column)} + ${increment}
    WHERE id = ${studentAssessmentId}
  `
}
