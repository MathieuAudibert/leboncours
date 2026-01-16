CREATE TYPE users_role AS ENUM ('Teacher', 'Admin', 'Student');
CREATE TYPE event_state AS ENUM ('Pending', 'Confirmed', 'Canceled', 'Done');

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role users_role NOT NULL, 
    password VARCHAR(255) NOT NULL,
    metadata JSONB
);

CREATE TABLE Courses (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    hourly_price INT NOT NULL,
    level VARCHAR(255),
    description TEXT
);

CREATE TABLE Availabilities (
    id SERIAL PRIMARY KEY,
    start_date DATE,
    end_date DATE,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES Courses(id) 
);

CREATE TABLE TeacherCourses (
    id SERIAL PRIMARY KEY,
    teacher_id INT,
    course_id INT,
    FOREIGN KEY (teacher_id) REFERENCES Users(id),
    FOREIGN KEY (course_id) REFERENCES Courses(id)
);

CREATE TABLE EventCourses (
    id SERIAL PRIMARY KEY,
    student_id INT,
    course_id INT,
    dates TIMESTAMP,
    state event_state NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Users(id),
    FOREIGN KEY (course_id) REFERENCES Courses(id)
);

CREATE TABLE Messages (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    content TEXT
);

CREATE TABLE MessagesUsers (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message_id INTEGER NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES Users(id),
    FOREIGN KEY (receiver_id) REFERENCES Users(id),
    FOREIGN KEY (message_id) REFERENCES Messages(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_id ON Users(id);
CREATE INDEX idx_courses_id ON Courses(id);
CREATE INDEX idx_availabilities_id ON Availabilities(id);
CREATE INDEX idx_teacher_courses_id ON TeacherCourses(id);
CREATE INDEX idx_event_courses_id ON EventCourses(id);
CREATE INDEX idx_messages_id ON Messages(id);
CREATE INDEX idx_messages_users_id ON MessagesUsers(id);