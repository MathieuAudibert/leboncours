CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Applying triggers to tables
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_skills_modtime BEFORE UPDATE ON skills FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_modtime BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- View for Mentor Profiles
CREATE VIEW view_mentor_profiles AS
SELECT 
    u.id as mentor_id,
    u.username,
    u.email,
    s.id as skill_id,
    s.title,
    s.price,
    s.is_active
FROM users u
JOIN skills s ON u.id = s.mentor_id
WHERE u.role = 'mentor';

-- View for Detailed Bookings
CREATE VIEW view_booking_details AS
SELECT 
    b.id as booking_id,
    stu.username as student_name,
    men.username as mentor_name,
    s.title as skill_title,
    b.scheduled_time,
    b.status
FROM bookings b
JOIN users stu ON b.student_id = stu.id
JOIN skills s ON b.skill_id = s.id
JOIN users men ON s.mentor_id = men.id;

-- Inserting Users (5 Mentors, 5 Students)
INSERT INTO users (username, email, password_hash, role, bio) VALUES
('dev_guru', 'alex@example.com', 'hash_123', 'mentor', 'Full-stack dev with 10 years experience.'),
('design_pro', 'sarah@example.com', 'hash_123', 'mentor', 'UI/UX Designer at a top tech firm.'),
('data_wiz', 'chen@example.com', 'hash_123', 'mentor', 'Data Scientist specializing in Python and ML.'),
('biz_coach', 'elena@example.com', 'hash_123', 'mentor', 'Entrepreneur and startup consultant.'),
('sql_master', 'postgres_fan@example.com', 'hash_123', 'mentor', 'DBA and query optimization expert.'),
('student_amy', 'amy@example.com', 'hash_456', 'student', 'Looking to learn React.'),
('student_bob', 'bob@example.com', 'hash_456', 'student', 'Interested in career coaching.'),
('student_claire', 'claire@example.com', 'hash_456', 'student', 'Beginner in Python.'),
('student_dan', 'dan@example.com', 'hash_456', 'student', 'Wants to improve Figma skills.'),
('student_eric', 'eric@example.com', 'hash_456', 'student', 'Deep dive into SQL.');

-- Inserting Skills for Mentors
INSERT INTO skills (mentor_id, title, description, price)
SELECT id, 'Advanced React Patterns', 'Learn hooks, context, and performance.', 50.00 FROM users WHERE username = 'dev_guru';
INSERT INTO skills (mentor_id, title, description, price)
SELECT id, 'Node.js Backend Architecture', 'Scalable systems with Express.', 65.00 FROM users WHERE username = 'dev_guru';
INSERT INTO skills (mentor_id, title, description, price)
SELECT id, 'Figma Masterclass', 'Design systems and prototyping.', 45.00 FROM users WHERE username = 'design_pro';
INSERT INTO skills (mentor_id, title, description, price)
SELECT id, 'Introduction to Pandas', 'Data manipulation for beginners.', 40.00 FROM users WHERE username = 'data_wiz';
INSERT INTO skills (mentor_id, title, description, price)
SELECT id, 'Machine Learning Basics', 'Scikit-learn and linear regression.', 75.00 FROM users WHERE username = 'data_wiz';
INSERT INTO skills (mentor_id, title, description, price)
SELECT id, 'Pitching to VCs', 'How to raise your first seed round.', 120.00 FROM users WHERE username = 'biz_coach';
INSERT INTO skills (mentor_id, title, description, price)
SELECT id, 'PostgreSQL Optimization', 'Explain analyze and indexing.', 90.00 FROM users WHERE username = 'sql_master';

-- Inserting Bookings
INSERT INTO bookings (student_id, skill_id, scheduled_time, status, notes)
SELECT 
    (SELECT id FROM users WHERE username = 'student_amy'),
    (SELECT id FROM skills WHERE title = 'Advanced React Patterns'),
    NOW() + INTERVAL '2 days',
    'confirmed',
    'I want to focus on UseMemo and UseCallback.';

INSERT INTO bookings (student_id, skill_id, scheduled_time, status, notes)
SELECT 
    (SELECT id FROM users WHERE username = 'student_bob'),
    (SELECT id FROM skills WHERE title = 'Pitching to VCs'),
    NOW() + INTERVAL '5 days',
    'pending',
    'Have a deck ready to review.';

INSERT INTO bookings (student_id, skill_id, scheduled_time, status, notes)
SELECT 
    (SELECT id FROM users WHERE username = 'student_claire'),
    (SELECT id FROM skills WHERE title = 'Introduction to Pandas'),
    NOW() - INTERVAL '1 day',
    'completed',
    'Great session!';

INSERT INTO bookings (student_id, skill_id, scheduled_time, status, notes)
SELECT 
    (SELECT id FROM users WHERE username = 'student_dan'),
    (SELECT id FROM skills WHERE title = 'Figma Masterclass'),
    NOW() + INTERVAL '3 days',
    'confirmed',
    'Need help with auto-layout.';

INSERT INTO bookings (student_id, skill_id, scheduled_time, status, notes)
SELECT 
    (SELECT id FROM users WHERE username = 'student_eric'),
    (SELECT id FROM skills WHERE title = 'PostgreSQL Optimization'),
    NOW() + INTERVAL '1 week',
    'rejected',
    'Mentor is on vacation.';

-- Additional 100+ lines of varied data patterns could be added here to stress test, 
-- but these blocks cover the essential functional logic and a diverse testing base.

