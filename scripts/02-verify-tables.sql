-- Verify that all tables exist and have correct structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'teachers', 'students', 'sessions')
ORDER BY table_name, ordinal_position;

-- Check if indexes exist
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'teachers', 'students', 'sessions');

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'teachers' as table_name, COUNT(*) as record_count FROM teachers
UNION ALL
SELECT 'students' as table_name, COUNT(*) as record_count FROM students
UNION ALL
SELECT 'sessions' as table_name, COUNT(*) as record_count FROM sessions;
