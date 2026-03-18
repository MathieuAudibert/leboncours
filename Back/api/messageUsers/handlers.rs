use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, Set};
use validator::Validate;
use super::dto::{CreateMessageUserRequest, UpdateMessageUserRequest, MessageUserQueryParams, MessageUserResponse};
use crate::api::common::PaginatedResponse;
use crate::api::error::ApiError;
use crate::DBState;
use crate::entities::messagesusers::{ActiveModel, Column, Entity};

// Create
#[utoipa::path(
    post,
    path = "/api/message-users/create",
    request_body = CreateMessageUserRequest,
    responses(
        (status = 201, description = "MessageUser created", body = MessageUserResponse),
        (status = 400, description = "Validation error", body = crate::api::error::ErrorResponse)
    ),
    tag = "MessageUsers"
)]
pub async fn create_message_user(
    State(state): State<DBState>,
    Json(payload): Json<CreateMessageUserRequest>,
) -> Result<(StatusCode, Json<MessageUserResponse>), ApiError> {
    payload.validate()?;

    let model = ActiveModel {
        sender_id: Set(payload.sender_id),
        receiver_id: Set(payload.receiver_id),
        message_id: Set(payload.message_id),
        ..Default::default()
    };

    let result = model.insert(&state.db).await?;

    Ok((StatusCode::CREATED, Json(MessageUserResponse::from(result))))
}

// Get by ID
#[utoipa::path(
    get,
    path = "/api/message-users/{id}",
    params(("id" = i32, Path, description = "MessageUser ID")),
    responses(
        (status = 200, description = "MessageUser found", body = MessageUserResponse),
        (status = 404, description = "MessageUser not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "MessageUsers"
)]
pub async fn get_message_user_by_id(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<Json<MessageUserResponse>, ApiError> {
    let result = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("MessageUser {} not found", id)))?;

    Ok(Json(MessageUserResponse::from(result)))
}

// List
#[utoipa::path(
    get,
    path = "/api/message-users/all",
    params(MessageUserQueryParams),
    responses(
        (status = 200, description = "List of message users", body = PaginatedResponse<MessageUserResponse>)
    ),
    tag = "MessageUsers"
)]
pub async fn list_message_users(
    State(state): State<DBState>,
    Query(params): Query<MessageUserQueryParams>,
) -> Result<Json<PaginatedResponse<MessageUserResponse>>, ApiError> {
    let page = params.page();
    let per_page = params.per_page();

    let mut query = Entity::find();

    if let Some(sender_id) = params.sender_id {
        query = query.filter(Column::SenderId.eq(sender_id));
    }
    if let Some(receiver_id) = params.receiver_id {
        query = query.filter(Column::ReceiverId.eq(receiver_id));
    }
    if let Some(message_id) = params.message_id {
        query = query.filter(Column::MessageId.eq(message_id));
    }

    query = query.order_by_asc(Column::Id);

    let paginator = query.paginate(&state.db, per_page);
    let (total, items) = tokio::try_join!(
        paginator.num_items(),
        paginator.fetch_page(page - 1)
    )?;

    let data: Vec<MessageUserResponse> = items.into_iter().map(MessageUserResponse::from).collect();

    Ok(Json(PaginatedResponse::new(data, page, per_page, total)))
}

// Update
#[utoipa::path(
    put,
    path = "/api/message-users/edit/{id}",
    params(("id" = i32, Path, description = "MessageUser ID")),
    request_body = UpdateMessageUserRequest,
    responses(
        (status = 200, description = "MessageUser updated", body = MessageUserResponse),
        (status = 404, description = "MessageUser not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "MessageUsers"
)]
pub async fn update_message_user(
    State(state): State<DBState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateMessageUserRequest>,
) -> Result<Json<MessageUserResponse>, ApiError> {
    payload.validate()?;

    let existing = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("MessageUser {} not found", id)))?;

    let mut active: ActiveModel = existing.into();

    if let Some(sender_id) = payload.sender_id {
        active.sender_id = Set(sender_id);
    }
    if let Some(receiver_id) = payload.receiver_id {
        active.receiver_id = Set(receiver_id);
    }
    if let Some(message_id) = payload.message_id {
        active.message_id = Set(message_id);
    }

    let result = active.update(&state.db).await?;

    Ok(Json(MessageUserResponse::from(result)))
}

// Delete
#[utoipa::path(
    delete,
    path = "/api/message-users/delete/{id}",
    params(("id" = i32, Path, description = "MessageUser ID")),
    responses(
        (status = 204, description = "MessageUser deleted"),
        (status = 404, description = "MessageUser not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "MessageUsers"
)]
pub async fn delete_message_user(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, ApiError> {
    let result = Entity::delete_by_id(id).exec(&state.db).await?;

    if result.rows_affected == 0 {
        return Err(ApiError::NotFound(format!("MessageUser {} not found", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}
