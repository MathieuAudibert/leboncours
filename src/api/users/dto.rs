use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

// Create
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateUserRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: String,
    #[validate(length(min = 1, max = 255))]
    pub firstname: String,
    #[validate(email, length(max = 255))]
    pub email: String,
    #[validate(length(min = 1, max = 50))]
    pub role: String,
    #[validate(length(min = 8, max = 255))]
    pub password: String,
    pub metadata: Option<serde_json::Value>,
}

// Update
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct UpdateUserRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: Option<String>,
    #[validate(length(min = 1, max = 255))]
    pub firstname: Option<String>,
    #[validate(email, length(max = 255))]
    pub email: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub role: Option<String>,
    #[validate(length(min = 8, max = 255))]
    pub password: Option<String>,
    pub metadata: Option<serde_json::Value>,
}

// Response
#[derive(Debug, Serialize, ToSchema)]
pub struct UserResponse {
    pub id: i32,
    pub name: String,
    pub firstname: String,
    pub email: String,
    pub role: String,
    pub metadata: Option<serde_json::Value>,
}

impl From<crate::entities::users::Model> for UserResponse {
    fn from(model: crate::entities::users::Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            firstname: model.firstname,
            email: model.email,
            role: model.role.to_string(),
            metadata: model.metadata.map(|json| json.into()),
        }
    }
}

// Query
#[derive(Debug, Deserialize, IntoParams)]
pub struct UserQueryParams {
    pub name: Option<String>,
    pub email: Option<String>,
    pub role: Option<String>,

    #[param(minimum = 1, default = 1)]
    pub page: Option<u64>,
    #[param(minimum = 1, maximum = 100, default = 10)]
    pub per_page: Option<u64>,
}

impl UserQueryParams {
    pub fn page(&self) -> u64 {
        self.page.unwrap_or(1).max(1)
    }
    pub fn per_page(&self) -> u64 {
        self.per_page.unwrap_or(20).clamp(1, 100)
    }
}