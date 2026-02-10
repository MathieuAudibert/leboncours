use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

// Create
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateCourseRequest {
    #[validate(length(min = 1, max = 255))]
    pub subject: String,
    pub hourly_price: i32,
    #[validate(length(max = 255))]
    pub level: Option<String>,
    pub description: Option<String>,
}

// Update
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct UpdateCourseRequest {
    #[validate(length(min = 1, max = 255))]
    pub subject: Option<String>,
    pub hourly_price: Option<i32>,
    #[validate(length(max = 255))]
    pub level: Option<String>,
    pub description: Option<String>,
}

// Response
#[derive(Debug, Serialize, ToSchema)]
pub struct CourseResponse {
    pub id: i32,
    pub subject: String,
    pub hourly_price: i32,
    pub level: Option<String>,
    pub description: Option<String>,
}

impl From<crate::entities::courses::Model> for CourseResponse {
    fn from(model: crate::entities::courses::Model) -> Self {
        Self {
            id: model.id,
            subject: model.subject,
            hourly_price: model.hourly_price,
            level: model.level,
            description: model.description,
        }
    }
}

// Query
#[derive(Debug, Deserialize, IntoParams)]
pub struct CourseQueryParams {
    pub subject: Option<String>,
    pub level: Option<String>,
    pub min_price: Option<i32>,
    pub max_price: Option<i32>,

    #[param(minimum = 1, default = 1)]
    pub page: Option<u64>,
    #[param(minimum = 1, maximum = 100, default = 10)]
    pub per_page: Option<u64>,
}

impl CourseQueryParams {
    pub fn page(&self) -> u64 {
        self.page.unwrap_or(1).max(1)
    }
    pub fn per_page(&self) -> u64 {
        self.per_page.unwrap_or(20).clamp(1, 100)
    }
}
