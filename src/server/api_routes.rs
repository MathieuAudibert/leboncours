use axum::Router;
use axum::routing::{get, post, put, delete};
use crate::DBState;
use crate::server::fn_path;
use crate::api;

pub fn path(state: DBState) -> Router {
    Router::new()
        .route("/", get(fn_path::home_page))
        // Users
        .route("/api/users/create", post(api::users::create_user))
        .route("/api/users/all", get(api::users::list))
        .route("/api/users/:id", get(api::users::get_by_id))
        .route("/api/users/edit/:id", put(api::users::update))
        .route("/api/users/delete/:id", delete(api::users::delete))
        // Courses
        .route("/api/courses/create", post(api::courses::create_course))
        .route("/api/courses/all", get(api::courses::list_courses))
        .route("/api/courses/:id", get(api::courses::get_course_by_id))
        .route("/api/courses/edit/:id", put(api::courses::update_course))
        .route("/api/courses/delete/:id", delete(api::courses::delete_course))
        // Availabilities
        .route("/api/availabilities/create", post(api::availabilities::create_availability))
        .route("/api/availabilities/all", get(api::availabilities::list_availabilities))
        .route("/api/availabilities/:id", get(api::availabilities::get_availability_by_id))
        .route("/api/availabilities/edit/:id", put(api::availabilities::update_availability))
        .route("/api/availabilities/delete/:id", delete(api::availabilities::delete_availability))
        // EventCourses
        .route("/api/event-courses/create", post(api::eventCourses::create_event_course))
        .route("/api/event-courses/all", get(api::eventCourses::list_event_courses))
        .route("/api/event-courses/:id", get(api::eventCourses::get_event_course_by_id))
        .route("/api/event-courses/edit/:id", put(api::eventCourses::update_event_course))
        .route("/api/event-courses/delete/:id", delete(api::eventCourses::delete_event_course))
        // TeacherCourses
        .route("/api/teacher-courses/create", post(api::teacherCourses::create_teacher_course))
        .route("/api/teacher-courses/all", get(api::teacherCourses::list_teacher_courses))
        .route("/api/teacher-courses/:id", get(api::teacherCourses::get_teacher_course_by_id))
        .route("/api/teacher-courses/edit/:id", put(api::teacherCourses::update_teacher_course))
        .route("/api/teacher-courses/delete/:id", delete(api::teacherCourses::delete_teacher_course))
        // Messages
        .route("/api/messages/create", post(api::messages::create_message))
        .route("/api/messages/all", get(api::messages::list_messages))
        .route("/api/messages/:id", get(api::messages::get_message_by_id))
        .route("/api/messages/edit/:id", put(api::messages::update_message))
        .route("/api/messages/delete/:id", delete(api::messages::delete_message))
        // MessageUsers
        .route("/api/message-users/create", post(api::messageUsers::create_message_user))
        .route("/api/message-users/all", get(api::messageUsers::list_message_users))
        .route("/api/message-users/:id", get(api::messageUsers::get_message_user_by_id))
        .route("/api/message-users/edit/:id", put(api::messageUsers::update_message_user))
        .route("/api/message-users/delete/:id", delete(api::messageUsers::delete_message_user))
        .with_state(state)
}