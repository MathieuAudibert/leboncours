use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

// Create
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateTeacherCourseRequest {
    pub teacher_id: Option<i32>,
    pub course_id: Option<i32>,
}

// Update
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct UpdateTeacherCourseRequest {
    pub teacher_id: Option<i32>,
    pub course_id: Option<i32>,
}

// Response
#[derive(Debug, Serialize, ToSchema)]
pub struct TeacherCourseResponse {
    pub id: i32,
    pub teacher_id: Option<i32>,
    pub course_id: Option<i32>,
}

impl From<crate::entities::teachercourses::Model> for TeacherCourseResponse {
    fn from(model: crate::entities::teachercourses::Model) -> Self {
        Self {
            id: model.id,
            teacher_id: model.teacher_id,
            course_id: model.course_id,
        }
    }
}

// Query
#[derive(Debug, Deserialize, IntoParams)]
pub struct TeacherCourseQueryParams {
    pub teacher_id: Option<i32>,
    pub course_id: Option<i32>,

    #[param(minimum = 1, default = 1)]
    pub page: Option<u64>,
    #[param(minimum = 1, maximum = 100, default = 10)]
    pub per_page: Option<u64>,
}

impl TeacherCourseQueryParams {
    pub fn page(&self) -> u64 {
        self.page.unwrap_or(1).max(1)
    }
    pub fn per_page(&self) -> u64 {
        self.per_page.unwrap_or(20).clamp(1, 100)
    }
}
