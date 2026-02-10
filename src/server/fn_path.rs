use utoipa::OpenApi;

#[utoipa::path(get, path = "/", responses((status = 200, description = "Page d'accueil")))]
pub async fn home_page() -> &'static str {
    "Home"
}

#[derive(OpenApi)]
#[openapi(
    paths(
        home_page,
        // Users
        crate::api::users::handlers::create_user,
        crate::api::users::handlers::get_by_id,
        crate::api::users::handlers::list,
        crate::api::users::handlers::update,
        crate::api::users::handlers::delete,
        // Courses
        crate::api::courses::handlers::create_course,
        crate::api::courses::handlers::get_course_by_id,
        crate::api::courses::handlers::list_courses,
        crate::api::courses::handlers::update_course,
        crate::api::courses::handlers::delete_course,
        // Availabilities
        crate::api::availabilities::handlers::create_availability,
        crate::api::availabilities::handlers::get_availability_by_id,
        crate::api::availabilities::handlers::list_availabilities,
        crate::api::availabilities::handlers::update_availability,
        crate::api::availabilities::handlers::delete_availability,
        // EventCourses
        crate::api::eventCourses::handlers::create_event_course,
        crate::api::eventCourses::handlers::get_event_course_by_id,
        crate::api::eventCourses::handlers::list_event_courses,
        crate::api::eventCourses::handlers::update_event_course,
        crate::api::eventCourses::handlers::delete_event_course,
        // TeacherCourses
        crate::api::teacherCourses::handlers::create_teacher_course,
        crate::api::teacherCourses::handlers::get_teacher_course_by_id,
        crate::api::teacherCourses::handlers::list_teacher_courses,
        crate::api::teacherCourses::handlers::update_teacher_course,
        crate::api::teacherCourses::handlers::delete_teacher_course,
        // Messages
        crate::api::messages::handlers::create_message,
        crate::api::messages::handlers::get_message_by_id,
        crate::api::messages::handlers::list_messages,
        crate::api::messages::handlers::update_message,
        crate::api::messages::handlers::delete_message,
        // MessageUsers
        crate::api::messageUsers::handlers::create_message_user,
        crate::api::messageUsers::handlers::get_message_user_by_id,
        crate::api::messageUsers::handlers::list_message_users,
        crate::api::messageUsers::handlers::update_message_user,
        crate::api::messageUsers::handlers::delete_message_user,
    ),
    components(schemas())
)]
pub struct ApiDoc;