// Register all resources

pub mod error;

pub mod availabilities;
pub mod courses;
pub mod eventCourses;
pub mod messages;
pub mod teacherCourses;
pub mod users;
pub mod messageUsers;
pub mod common;

// Re-export shared error type
pub use error::ApiError;