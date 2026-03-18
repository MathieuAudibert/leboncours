use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

// Create
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateAvailabilityRequest {
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub course_id: Option<i32>,
}

// Update
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct UpdateAvailabilityRequest {
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub course_id: Option<i32>,
}

// Response
#[derive(Debug, Serialize, ToSchema)]
pub struct AvailabilityResponse {
    pub id: i32,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub course_id: Option<i32>,
}

impl From<crate::entities::availabilities::Model> for AvailabilityResponse {
    fn from(model: crate::entities::availabilities::Model) -> Self {
        Self {
            id: model.id,
            start_date: model.start_date.map(|d| d.to_string()),
            end_date: model.end_date.map(|d| d.to_string()),
            start_time: model.start_time.map(|t| t.to_string()),
            end_time: model.end_time.map(|t| t.to_string()),
            course_id: model.course_id,
        }
    }
}

// Query
#[derive(Debug, Deserialize, IntoParams)]
pub struct AvailabilityQueryParams {
    pub course_id: Option<i32>,

    #[param(minimum = 1, default = 1)]
    pub page: Option<u64>,
    #[param(minimum = 1, maximum = 100, default = 10)]
    pub per_page: Option<u64>,
}

impl AvailabilityQueryParams {
    pub fn page(&self) -> u64 {
        self.page.unwrap_or(1).max(1)
    }
    pub fn per_page(&self) -> u64 {
        self.per_page.unwrap_or(20).clamp(1, 100)
    }
}
