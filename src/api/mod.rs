// Register all resources

pub mod error;

pub mod availabilities;
pub mod courses;
pub mod eventCourses;
pub mod messages;
pub mod messagesUsers;
pub mod teacherCourses;
pub mod users;

// Re-export shared error type
pub use error::ApiError;