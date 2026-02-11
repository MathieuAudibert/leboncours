use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, Set};
use sea_orm::prelude::{Date, DateTime};
use validator::Validate;
use super::dto::{CreateAvailabilityRequest, UpdateAvailabilityRequest, AvailabilityQueryParams, AvailabilityResponse};
use crate::api::common::PaginatedResponse;
use crate::api::error::ApiError;
use crate::DBState;
use crate::entities::availabilities::{ActiveModel, Column, Entity};

fn parse_date(s: &str) -> Result<Date, ApiError> {
    chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d")
        .map_err(|_| ApiError::ValidationError(format!("Invalid date format: {}, expected YYYY-MM-DD", s)))
}

fn parse_datetime(s: &str) -> Result<DateTime, ApiError> {
    chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%dT%H:%M:%S")
        .or_else(|_| chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S"))
        .map_err(|_| ApiError::ValidationError(format!("Invalid datetime format: {}, expected YYYY-MM-DDTHH:MM:SS", s)))
}

// Create
#[utoipa::path(
    post,
    path = "/api/availabilities/create",
    request_body = CreateAvailabilityRequest,
    responses(
        (status = 201, description = "Availability created", body = AvailabilityResponse),
        (status = 400, description = "Validation error", body = crate::api::error::ErrorResponse)
    ),
    tag = "Availabilities"
)]
pub async fn create_availability(
    State(state): State<DBState>,
    Json(payload): Json<CreateAvailabilityRequest>,
) -> Result<(StatusCode, Json<AvailabilityResponse>), ApiError> {
    payload.validate()?;

    let start_date = payload.start_date.as_deref().map(parse_date).transpose()?;
    let end_date = payload.end_date.as_deref().map(parse_date).transpose()?;
    let start_time = payload.start_time.as_deref().map(parse_datetime).transpose()?;
    let end_time = payload.end_time.as_deref().map(parse_datetime).transpose()?;

    let model = ActiveModel {
        start_date: Set(start_date),
        end_date: Set(end_date),
        start_time: Set(start_time),
        end_time: Set(end_time),
        course_id: Set(payload.course_id),
        ..Default::default()
    };

    let result = model.insert(&state.db).await?;

    Ok((StatusCode::CREATED, Json(AvailabilityResponse::from(result))))
}

// Get by ID
#[utoipa::path(
    get,
    path = "/api/availabilities/{id}",
    params(("id" = i32, Path, description = "Availability ID")),
    responses(
        (status = 200, description = "Availability found", body = AvailabilityResponse),
        (status = 404, description = "Availability not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Availabilities"
)]
pub async fn get_availability_by_id(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<Json<AvailabilityResponse>, ApiError> {
    let result = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Availability {} not found", id)))?;

    Ok(Json(AvailabilityResponse::from(result)))
}

// List
#[utoipa::path(
    get,
    path = "/api/availabilities/all",
    params(AvailabilityQueryParams),
    responses(
        (status = 200, description = "List of availabilities", body = PaginatedResponse<AvailabilityResponse>)
    ),
    tag = "Availabilities"
)]
pub async fn list_availabilities(
    State(state): State<DBState>,
    Query(params): Query<AvailabilityQueryParams>,
) -> Result<Json<PaginatedResponse<AvailabilityResponse>>, ApiError> {
    let page = params.page();
    let per_page = params.per_page();

    let mut query = Entity::find();

    if let Some(course_id) = params.course_id {
        query = query.filter(Column::CourseId.eq(course_id));
    }

    query = query.order_by_asc(Column::StartDate);

    let paginator = query.paginate(&state.db, per_page);
    let total = paginator.num_items().await?;
    let items = paginator.fetch_page(page - 1).await?;

    let data: Vec<AvailabilityResponse> = items.into_iter().map(AvailabilityResponse::from).collect();

    Ok(Json(PaginatedResponse::new(data, page, per_page, total)))
}

// Update
#[utoipa::path(
    put,
    path = "/api/availabilities/edit/{id}",
    params(("id" = i32, Path, description = "Availability ID")),
    request_body = UpdateAvailabilityRequest,
    responses(
        (status = 200, description = "Availability updated", body = AvailabilityResponse),
        (status = 404, description = "Availability not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Availabilities"
)]
pub async fn update_availability(
    State(state): State<DBState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateAvailabilityRequest>,
) -> Result<Json<AvailabilityResponse>, ApiError> {
    payload.validate()?;

    let existing = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Availability {} not found", id)))?;

    let mut active: ActiveModel = existing.into();

    if let Some(ref start_date) = payload.start_date {
        active.start_date = Set(Some(parse_date(start_date)?));
    }
    if let Some(ref end_date) = payload.end_date {
        active.end_date = Set(Some(parse_date(end_date)?));
    }
    if let Some(ref start_time) = payload.start_time {
        active.start_time = Set(Some(parse_datetime(start_time)?));
    }
    if let Some(ref end_time) = payload.end_time {
        active.end_time = Set(Some(parse_datetime(end_time)?));
    }
    if let Some(course_id) = payload.course_id {
        active.course_id = Set(Some(course_id));
    }

    let result = active.update(&state.db).await?;

    Ok(Json(AvailabilityResponse::from(result)))
}

// Delete
#[utoipa::path(
    delete,
    path = "/api/availabilities/delete/{id}",
    params(("id" = i32, Path, description = "Availability ID")),
    responses(
        (status = 204, description = "Availability deleted"),
        (status = 404, description = "Availability not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Availabilities"
)]
pub async fn delete_availability(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, ApiError> {
    let result = Entity::delete_by_id(id).exec(&state.db).await?;

    if result.rows_affected == 0 {
        return Err(ApiError::NotFound(format!("Availability {} not found", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}
