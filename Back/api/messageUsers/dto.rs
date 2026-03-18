use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

// Create
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateMessageUserRequest {
    pub sender_id: i32,
    pub receiver_id: i32,
    pub message_id: i32,
}

// Update
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct UpdateMessageUserRequest {
    pub sender_id: Option<i32>,
    pub receiver_id: Option<i32>,
    pub message_id: Option<i32>,
}

// Response
#[derive(Debug, Serialize, ToSchema)]
pub struct MessageUserResponse {
    pub id: i32,
    pub sender_id: i32,
    pub receiver_id: i32,
    pub message_id: i32,
}

impl From<crate::entities::messagesusers::Model> for MessageUserResponse {
    fn from(model: crate::entities::messagesusers::Model) -> Self {
        Self {
            id: model.id,
            sender_id: model.sender_id,
            receiver_id: model.receiver_id,
            message_id: model.message_id,
        }
    }
}

// Query
#[derive(Debug, Deserialize, IntoParams)]
pub struct MessageUserQueryParams {
    pub sender_id: Option<i32>,
    pub receiver_id: Option<i32>,
    pub message_id: Option<i32>,

    #[param(minimum = 1, default = 1)]
    pub page: Option<u64>,
    #[param(minimum = 1, maximum = 100, default = 10)]
    pub per_page: Option<u64>,
}

impl MessageUserQueryParams {
    pub fn page(&self) -> u64 {
        self.page.unwrap_or(1).max(1)
    }
    pub fn per_page(&self) -> u64 {
        self.per_page.unwrap_or(20).clamp(1, 100)
    }
}
