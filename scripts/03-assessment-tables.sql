-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_marks INTEGER DEFAULT 0,
  duration_minutes INTEGER NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  is_published BOOLEAN DEFAULT false,
  allow_late_submission BOOLEAN DEFAULT false,
  randomize_questions BOOLEAN DEFAULT false,
  show_results_immediately BOOLEAN DEFAULT false,
  face_detection_enabled BOOLEAN DEFAULT true,
  screen_recording_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assessment sections table
CREATE TABLE IF NOT EXISTS assessment_sections (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER REFERENCES assessments(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  section_type VARCHAR(20) NOT NULL CHECK (section_type IN ('mcq', 'msq', 'subjective', 'coding')),
  time_limit_minutes INTEGER,
  marks_per_question INTEGER DEFAULT 1,
  negative_marking DECIMAL(3,2) DEFAULT 0,
  section_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES assessment_sections(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('mcq', 'msq', 'subjective', 'coding')),
  marks INTEGER DEFAULT 1,
  difficulty_level VARCHAR(10) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  question_order INTEGER NOT NULL,
  
  -- For coding questions
  programming_language VARCHAR(50),
  starter_code TEXT,
  test_cases JSONB,
  time_limit_seconds INTEGER DEFAULT 300,
  memory_limit_mb INTEGER DEFAULT 128,
  
  -- For MCQ/MSQ questions
  options JSONB,
  correct_answers JSONB,
  
  -- For subjective questions
  max_words INTEGER,
  sample_answer TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create student assessments table (enrollment)
CREATE TABLE IF NOT EXISTS student_assessments (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER REFERENCES assessments(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  submitted_at TIMESTAMP,
  time_spent_minutes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'started', 'submitted', 'evaluated')),
  total_score DECIMAL(5,2) DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Anti-cheating data
  face_detection_violations INTEGER DEFAULT 0,
  tab_switch_count INTEGER DEFAULT 0,
  copy_paste_attempts INTEGER DEFAULT 0,
  suspicious_activity_log JSONB,
  
  UNIQUE(assessment_id, student_id)
);

-- Create student answers table
CREATE TABLE IF NOT EXISTS student_answers (
  id SERIAL PRIMARY KEY,
  student_assessment_id INTEGER REFERENCES student_assessments(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  selected_options JSONB,
  code_submission TEXT,
  execution_result JSONB,
  marks_awarded DECIMAL(5,2) DEFAULT 0,
  is_correct BOOLEAN DEFAULT false,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  time_spent_seconds INTEGER DEFAULT 0,
  
  UNIQUE(student_assessment_id, question_id)
);

-- Create assessment monitoring table
CREATE TABLE IF NOT EXISTS assessment_monitoring (
  id SERIAL PRIMARY KEY,
  student_assessment_id INTEGER REFERENCES student_assessments(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_teacher_id ON assessments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assessments_published ON assessments(is_published);
CREATE INDEX IF NOT EXISTS idx_assessment_sections_assessment_id ON assessment_sections(assessment_id);
CREATE INDEX IF NOT EXISTS idx_questions_section_id ON questions(section_id);
CREATE INDEX IF NOT EXISTS idx_student_assessments_assessment_id ON student_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_student_assessments_student_id ON student_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_student_assessment_id ON student_answers(student_assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_monitoring_student_assessment_id ON assessment_monitoring(student_assessment_id);
