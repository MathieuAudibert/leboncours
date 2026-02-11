use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

// Create
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateMessageRequest {
    pub content: Option<String>,
}

// Update
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct UpdateMessageRequest {
    pub content: Option<String>,
}

// Response
#[derive(Debug, Serialize, ToSchema)]
pub struct MessageResponse {
    pub id: i32,
    pub created_at: String,
    pub content: Option<String>,
}

impl From<crate::entities::messages::Model> for MessageResponse {
    fn from(model: crate::entities::messages::Model) -> Self {
        Self {
            id: model.id,
            created_at: model.created_at.to_string(),
            content: model.content,
        }
    }
}

// Query
#[derive(Debug, Deserialize, IntoParams)]
pub struct MessageQueryParams {
    #[param(minimum = 1, default = 1)]
    pub page: Option<u64>,
    #[param(minimum = 1, maximum = 100, default = 10)]
    pub per_page: Option<u64>,
}

impl MessageQueryParams {
    pub fn page(&self) -> u64 {
        self.page.unwrap_or(1).max(1)
    }
    pub fn per_page(&self) -> u64 {
        self.per_page.unwrap_or(20).clamp(1, 100)
    }
}
