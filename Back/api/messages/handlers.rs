use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use sea_orm::{ActiveModelTrait, EntityTrait, PaginatorTrait, QueryOrder, Set};
use chrono::Utc;
use validator::Validate;
use super::dto::{CreateMessageRequest, UpdateMessageRequest, MessageQueryParams, MessageResponse};
use crate::api::common::PaginatedResponse;
use crate::api::error::ApiError;
use crate::DBState;
use crate::entities::messages::{ActiveModel, Column, Entity};

// Create
#[utoipa::path(
    post,
    path = "/api/messages/create",
    request_body = CreateMessageRequest,
    responses(
        (status = 201, description = "Message created", body = MessageResponse),
        (status = 400, description = "Validation error", body = crate::api::error::ErrorResponse)
    ),
    tag = "Messages"
)]
pub async fn create_message(
    State(state): State<DBState>,
    Json(payload): Json<CreateMessageRequest>,
) -> Result<(StatusCode, Json<MessageResponse>), ApiError> {
    payload.validate()?;

    let model = ActiveModel {
        created_at: Set(Utc::now().naive_utc()),
        content: Set(payload.content),
        ..Default::default()
    };

    let result = model.insert(&state.db).await?;

    Ok((StatusCode::CREATED, Json(MessageResponse::from(result))))
}

// Get by ID
#[utoipa::path(
    get,
    path = "/api/messages/{id}",
    params(("id" = i32, Path, description = "Message ID")),
    responses(
        (status = 200, description = "Message found", body = MessageResponse),
        (status = 404, description = "Message not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Messages"
)]
pub async fn get_message_by_id(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<Json<MessageResponse>, ApiError> {
    let result = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Message {} not found", id)))?;

    Ok(Json(MessageResponse::from(result)))
}

// List
#[utoipa::path(
    get,
    path = "/api/messages/all",
    params(MessageQueryParams),
    responses(
        (status = 200, description = "List of messages", body = PaginatedResponse<MessageResponse>)
    ),
    tag = "Messages"
)]
pub async fn list_messages(
    State(state): State<DBState>,
    Query(params): Query<MessageQueryParams>,
) -> Result<Json<PaginatedResponse<MessageResponse>>, ApiError> {
    let page = params.page();
    let per_page = params.per_page();

    let query = Entity::find().order_by_desc(Column::CreatedAt);

    let paginator = query.paginate(&state.db, per_page);
    let (total, items) = tokio::try_join!(
        paginator.num_items(),
        paginator.fetch_page(page - 1)
    )?;

    let data: Vec<MessageResponse> = items.into_iter().map(MessageResponse::from).collect();

    Ok(Json(PaginatedResponse::new(data, page, per_page, total)))
}

// Update
#[utoipa::path(
    put,
    path = "/api/messages/edit/{id}",
    params(("id" = i32, Path, description = "Message ID")),
    request_body = UpdateMessageRequest,
    responses(
        (status = 200, description = "Message updated", body = MessageResponse),
        (status = 404, description = "Message not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Messages"
)]
pub async fn update_message(
    State(state): State<DBState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateMessageRequest>,
) -> Result<Json<MessageResponse>, ApiError> {
    payload.validate()?;

    let existing = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Message {} not found", id)))?;

    let mut active: ActiveModel = existing.into();

    if let Some(content) = payload.content {
        active.content = Set(Some(content));
    }

    let result = active.update(&state.db).await?;

    Ok(Json(MessageResponse::from(result)))
}

// Delete
#[utoipa::path(
    delete,
    path = "/api/messages/delete/{id}",
    params(("id" = i32, Path, description = "Message ID")),
    responses(
        (status = 204, description = "Message deleted"),
        (status = 404, description = "Message not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Messages"
)]
pub async fn delete_message(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, ApiError> {
    let result = Entity::delete_by_id(id).exec(&state.db).await?;

    if result.rows_affected == 0 {
        return Err(ApiError::NotFound(format!("Message {} not found", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}
