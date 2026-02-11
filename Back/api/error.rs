use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

use serde::Serialize;
use utoipa::ToSchema;

#[derive(Debug)]
pub enum ApiError {
    DatabaseError(sea_orm::DbErr),
    NotFound(String),
    ValidationError(String),
    Conflict(String),
    Unauthorized(String),
    InternalError(String),
}

#[derive(Debug, Serialize, ToSchema)]
pub struct ErrorResponse {
    pub error: String,
    pub status: u16,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            ApiError::DatabaseError(e) => {
                tracing::error!("Database error: {:?}", e);
                (StatusCode::INTERNAL_SERVER_ERROR, "Database error".into())
            }
            ApiError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            ApiError::ValidationError(msg) => (StatusCode::BAD_REQUEST, msg),
            ApiError::Conflict(msg) => (StatusCode::CONFLICT, msg),
            ApiError::Unauthorized(msg) => (StatusCode::UNAUTHORIZED, msg),
            ApiError::InternalError(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        (status, Json(ErrorResponse {
            error: message,
            status: status.as_u16(),
        })).into_response()
    }
}

impl From<sea_orm::DbErr> for ApiError {
    fn from(err: sea_orm::DbErr) -> Self {
        ApiError::DatabaseError(err)
    }
}

impl From<validator::ValidationErrors> for ApiError {
    fn from(err: validator::ValidationErrors) -> Self {
        ApiError::ValidationError(err.to_string())
    }
}