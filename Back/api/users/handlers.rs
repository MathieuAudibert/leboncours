use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, Set};
use validator::Validate;
use super::dto::{CreateUserRequest, UpdateUserRequest, UserQueryParams, UserResponse};
use crate::api::common::{hash_password, PaginatedResponse};
use crate::api::error::ApiError;
use crate::DBState;
use crate::entities::users::{ActiveModel, Column, Entity};

//Create
#[utoipa::path(
    post,
    path = "/api/users/create",
    request_body = CreateUserRequest,
    responses(
        (status = 201, description = "User created", body = UserResponse),
        (status = 400, description = "Validation error", body = crate::api::error::ErrorResponse),
        (status = 409, description = "Email already exists", body = crate::api::error::ErrorResponse)
    ),
    tag = "Users"
)]
pub async fn create_user(
    State(state): State<DBState>,
    Json(payload): Json<CreateUserRequest>,
) -> Result<(StatusCode, Json<UserResponse>), ApiError> {
    payload.validate()?;

    let existing = Entity::find()
        .filter(Column::Email.eq(&payload.email))
        .one(&state.db)
        .await?;

    if existing.is_some() {
        return Err(ApiError::Conflict("Email already exists".into()));
    }

    // Hash password
    let password_hash = hash_password(&payload.password)?;

    let model = ActiveModel {
        name: Set(payload.name),
        firstname: Set(payload.firstname),
        email: Set(payload.email),
        role: Set(payload.role),
        password: Set(password_hash),
        metadata: Set(payload.metadata),
        ..Default::default()
    };

    let result = model.insert(&state.db).await?;

    Ok((StatusCode::CREATED, Json(UserResponse::from(result))))
}

// Get by ID
#[utoipa::path(
    get,
    path = "/api/users/{id}",
    params(("id" = i32, Path, description = "User ID")),
    responses(
        (status = 200, description = "User found", body = UserResponse),
        (status = 404, description = "User not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Users"
)]
pub async fn get_by_id(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<Json<UserResponse>, ApiError> {
    let result = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("User {} not found", id)))?;

    Ok(Json(UserResponse::from(result)))
}

// List
#[utoipa::path(
    get,
    path = "/api/users/all",
    params(UserQueryParams),
    responses(
        (status = 200, description = "List of users", body = PaginatedResponse<UserResponse>)
    ),
    tag = "Users"
)]
pub async fn list(
    State(state): State<DBState>,
    Query(params): Query<UserQueryParams>,
) -> Result<Json<PaginatedResponse<UserResponse>>, ApiError> {
    let page = params.page();
    let per_page = params.per_page();

    let mut query = Entity::find();

    // Filters
    if let Some(ref name) = params.name {
        query = query.filter(Column::Name.contains(name));
    }
    if let Some(ref email) = params.email {
        query = query.filter(Column::Email.contains(email));
    }
    if let Some(ref role) = params.role {
        query = query.filter(Column::Role.eq(role));
    }

    // Order
    query = query.order_by_asc(Column::Name);

    // Paginate
    let paginator = query.paginate(&state.db, per_page);
    let (total, items) = tokio::try_join!(
        paginator.num_items(),
        paginator.fetch_page(page - 1)
    )?;

    let data: Vec<UserResponse> = items.into_iter().map(UserResponse::from).collect();

    Ok(Json(PaginatedResponse::new(data, page, per_page, total)))
}

// Update
#[utoipa::path(
    put,
    path = "/api/users/edit/{id}",
    params(("id" = i32, Path, description = "User ID")),
    request_body = UpdateUserRequest,
    responses(
        (status = 200, description = "User updated", body = UserResponse),
        (status = 404, description = "User not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Users"
)]
pub async fn update(
    State(state): State<DBState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateUserRequest>,
) -> Result<Json<UserResponse>, ApiError> {
    payload.validate()?;

    let existing = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("User {} not found", id)))?;

    let mut active: ActiveModel = existing.into();

    if let Some(name) = payload.name {
        active.name = Set(name);
    }
    if let Some(firstname) = payload.firstname {
        active.firstname = Set(firstname);
    }
    if let Some(email) = payload.email {
        active.email = Set(email);
    }
    if let Some(role) = payload.role {
        active.role = Set(role);
    }
    if let Some(password) = payload.password {
        let password_hash = hash_password(&password)?;
        active.password = Set(password_hash);
    }
    if let Some(metadata) = payload.metadata {
        active.metadata = Set(Some(metadata));
    }

    let result = active.update(&state.db).await?;

    Ok(Json(UserResponse::from(result)))
}

// Delete
#[utoipa::path(
    delete,
    path = "/api/users/delete/{id}",
    params(("id" = i32, Path, description = "User ID")),
    responses(
        (status = 204, description = "User deleted"),
        (status = 404, description = "User not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Users"
)]
pub async fn delete(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, ApiError> {
    let result = Entity::delete_by_id(id).exec(&state.db).await?;

    if result.rows_affected == 0 {
        return Err(ApiError::NotFound(format!("User {} not found", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}