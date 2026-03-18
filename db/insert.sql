INSERT INTO Users (name, firstname, email, role, password, metadata) VALUES
('Admin', 'System', 'admin@edu.com', 'Admin', 'hash123', '{"bio": "Lead Admin", "created_at": "2026-01-01", "updated_at": "2026-01-01"}'),
('Vinci', 'Leo', 'leo@edu.com', 'Teacher', 'hash123', '{"bio": "Art & Math Guru", "created_at": "2026-01-02", "updated_at": "2026-01-02"}'),
('Curie', 'Marie', 'marie@edu.com', 'Teacher', 'hash123', '{"bio": "Science Lead", "created_at": "2026-01-02", "updated_at": "2026-01-05"}'),
('Turing', 'Alan', 'alan@edu.com', 'Teacher', 'hash123', '{"bio": "CS Pioneer", "created_at": "2026-01-03", "updated_at": "2026-01-03"}'),
('Smith', 'Alice', 'alice@stud.com', 'Student', 'hash123', '{"bio": "Biology student", "created_at": "2026-01-10", "updated_at": "2026-01-10"}'),
('Jones', 'Bob', 'bob@stud.com', 'Student', 'hash123', '{"bio": "Loves History", "created_at": "2026-01-10", "updated_at": "2026-01-10"}'),
('Brown', 'Charlie', 'charlie@stud.com', 'Student', 'hash123', '{"bio": "Aspiring Artist", "created_at": "2026-01-11", "updated_at": "2026-01-11"}'),
('Davis', 'Diana', 'diana@stud.com', 'Student', 'hash123', '{"bio": "Physics major", "created_at": "2026-01-11", "updated_at": "2026-01-11"}'),
('Evans', 'Edward', 'ed@stud.com', 'Student', 'hash123', '{"bio": "CS freshman", "created_at": "2026-01-12", "updated_at": "2026-01-12"}'),
('Foster', 'Fiona', 'fiona@stud.com', 'Student', 'hash123', '{"bio": "Math enthusiast", "created_at": "2026-01-12", "updated_at": "2026-01-12"}'),
('Garcia', 'Gabe', 'gabe@stud.com', 'Student', 'hash123', '{"bio": "Student", "created_at": "2026-01-13", "updated_at": "2026-01-13"}'),
('Harris', 'Helen', 'helen@stud.com', 'Student', 'hash123', '{"bio": "Student", "created_at": "2026-01-13", "updated_at": "2026-01-13"}'),
('Ivanov', 'Igor', 'igor@stud.com', 'Student', 'hash123', '{"bio": "Student", "created_at": "2026-01-14", "updated_at": "2026-01-14"}'),
('Kim', 'Kevin', 'kevin@stud.com', 'Student', 'hash123', '{"bio": "Student", "created_at": "2026-01-14", "updated_at": "2026-01-14"}'),
('Lopez', 'Laura', 'laura@stud.com', 'Student', 'hash123', '{"bio": "Student", "created_at": "2026-01-15", "updated_at": "2026-01-15"}');

INSERT INTO Courses (subject, hourly_price, level, description) VALUES
('Calculus', 50, 'Advanced', 'Limits and Derivatives'),
('Physics I', 45, 'Beginner', 'Classical Mechanics'),
('Art History', 30, 'Intermediate', 'The Renaissance'),
('Python 101', 55, 'Beginner', 'Intro to Scripting'),
('Philosophy', 35, 'Intermediate', 'Logic and Ethics');

INSERT INTO TeacherCourses (teacher_id, course_id) VALUES
(2, 1), (2, 3), (3, 2), (4, 4), (3, 5);

INSERT INTO Availabilities (start_date, end_date, start_time, end_time, course_id) VALUES
('2026-02-01', '2026-02-01', '2026-02-01 09:00:00', '2026-02-01 11:00:00', 1),
('2026-02-01', '2026-02-01', '2026-02-01 14:00:00', '2026-02-01 16:00:00', 2),
('2026-02-02', '2026-02-02', '2026-02-02 10:00:00', '2026-02-02 12:00:00', 3),
('2026-02-03', '2026-02-03', '2026-02-03 09:00:00', '2026-02-03 11:00:00', 4),
('2026-02-04', '2026-02-04', '2026-02-04 13:00:00', '2026-02-04 15:00:00', 5);

INSERT INTO EventCourses (student_id, course_id, dates, state) VALUES
(5, 2, '2026-02-10 10:00:00', 'Confirmed'),
(6, 3, '2026-02-11 14:00:00', 'Pending'),
(7, 3, '2026-02-11 14:00:00', 'Confirmed'),
(8, 1, '2026-02-12 09:00:00', 'Done'),
(9, 4, '2026-02-13 11:00:00', 'Confirmed'),
(10, 1, '2026-02-14 09:00:00', 'Canceled'),
(11, 5, '2026-02-15 13:00:00', 'Confirmed'),
(12, 4, '2026-02-16 11:00:00', 'Pending'),
(13, 2, '2026-02-17 10:00:00', 'Confirmed'),
(14, 1, '2026-02-18 09:00:00', 'Done');

INSERT INTO Messages (created_at, content) VALUES
('2026-01-20 08:00:00', 'Welcome to the Calculus course!'),
('2026-01-20 10:30:00', 'Is there any required reading for Art History?'),
('2026-01-21 09:15:00', 'The Python lab is moved to Room 4.'),
('2026-01-22 14:00:00', 'Can I join the Philosophy session late?'),
('2026-01-23 16:45:00', 'Grade for Physics has been posted.');

INSERT INTO MessagesUsers (sender_id, receiver_id, message_id) VALUES
(2, 8, 1), (6, 2, 2), (4, 9, 3), (11, 3, 4), (3, 5, 5);