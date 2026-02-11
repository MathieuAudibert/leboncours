use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;
use crate::entities::sea_orm_active_enums::EventState;

// Create
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateEventCourseRequest {
    pub student_id: Option<i32>,
    pub course_id: Option<i32>,
    pub dates: Option<String>,
    pub state: Option<EventState>,
}

// Update
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct UpdateEventCourseRequest {
    pub student_id: Option<i32>,
    pub course_id: Option<i32>,
    pub dates: Option<String>,
    pub state: Option<EventState>,
}

// Response
#[derive(Debug, Serialize, ToSchema)]
pub struct EventCourseResponse {
    pub id: i32,
    pub student_id: Option<i32>,
    pub course_id: Option<i32>,
    pub dates: Option<String>,
    pub state: String,
}

impl From<crate::entities::eventcourses::Model> for EventCourseResponse {
    fn from(model: crate::entities::eventcourses::Model) -> Self {
        Self {
            id: model.id,
            student_id: model.student_id,
            course_id: model.course_id,
            dates: model.dates.map(|d| d.to_string()),
            state: model.state.to_string(),
        }
    }
}

// Query
#[derive(Debug, Deserialize, IntoParams)]
pub struct EventCourseQueryParams {
    pub student_id: Option<i32>,
    pub course_id: Option<i32>,
    pub state: Option<String>,

    #[param(minimum = 1, default = 1)]
    pub page: Option<u64>,
    #[param(minimum = 1, maximum = 100, default = 10)]
    pub per_page: Option<u64>,
}

impl EventCourseQueryParams {
    pub fn page(&self) -> u64 {
        self.page.unwrap_or(1).max(1)
    }
    pub fn per_page(&self) -> u64 {
        self.per_page.unwrap_or(20).clamp(1, 100)
    }
}
