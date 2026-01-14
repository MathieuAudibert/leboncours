CREATE TYPE course_state AS ENUM ('Available', 'Booked', 'Done');
CREATE TYPE users_role AS ENUM ('Teacher', 'Student', 'Admin');

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role users_role NOT NULL,
    password VARCHAR(255) NOT NULL,
    metadata JSONB
);

CREATE TABLE EventCourses (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    hourly_price INTEGER NOT NULL,
    level VARCHAR(255),
    state course_state NOT NULL
);

CREATE TABLE Messages (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE EventCourseUsers (
    id SERIAL PRIMARY KEY,
    fk_teacher_id INTEGER NOT NULL,
    fk_student_id INTEGER,
    fk_course_event_id INTEGER NOT NULL,
    FOREIGN KEY (fk_course_event_id) REFERENCES EventCourses(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_student_id) REFERENCES Users(id),
    FOREIGN KEY (fk_teacher_id) REFERENCES Users(id)
);

CREATE TABLE MessageUsers (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message_id INTEGER NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES Users(id),
    FOREIGN KEY (receiver_id) REFERENCES Users(id),
    FOREIGN KEY (message_id) REFERENCES Messages(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_id ON Users(id);
CREATE INDEX idx_event_course_id ON EventCourses(id);
CREATE INDEX idx_message_id ON Messages(id);
CREATE INDEX idx_event_course_user_id ON EventCourseUsers(id);
CREATE INDEX idx_message_user_id ON MessageUsers(id);