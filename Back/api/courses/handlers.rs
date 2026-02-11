use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, Set};
use validator::Validate;
use super::dto::{CreateCourseRequest, UpdateCourseRequest, CourseQueryParams, CourseResponse};
use crate::api::common::PaginatedResponse;
use crate::api::error::ApiError;
use crate::DBState;
use crate::entities::courses::{ActiveModel, Column, Entity};

// Create
#[utoipa::path(
    post,
    path = "/api/courses/create",
    request_body = CreateCourseRequest,
    responses(
        (status = 201, description = "Course created", body = CourseResponse),
        (status = 400, description = "Validation error", body = crate::api::error::ErrorResponse)
    ),
    tag = "Courses"
)]
pub async fn create_course(
    State(state): State<DBState>,
    Json(payload): Json<CreateCourseRequest>,
) -> Result<(StatusCode, Json<CourseResponse>), ApiError> {
    payload.validate()?;

    let model = ActiveModel {
        subject: Set(payload.subject),
        hourly_price: Set(payload.hourly_price),
        level: Set(payload.level),
        description: Set(payload.description),
        ..Default::default()
    };

    let result = model.insert(&state.db).await?;

    Ok((StatusCode::CREATED, Json(CourseResponse::from(result))))
}

// Get by ID
#[utoipa::path(
    get,
    path = "/api/courses/{id}",
    params(("id" = i32, Path, description = "Course ID")),
    responses(
        (status = 200, description = "Course found", body = CourseResponse),
        (status = 404, description = "Course not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Courses"
)]
pub async fn get_course_by_id(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<Json<CourseResponse>, ApiError> {
    let result = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Course {} not found", id)))?;

    Ok(Json(CourseResponse::from(result)))
}

// List
#[utoipa::path(
    get,
    path = "/api/courses/all",
    params(CourseQueryParams),
    responses(
        (status = 200, description = "List of courses", body = PaginatedResponse<CourseResponse>)
    ),
    tag = "Courses"
)]
pub async fn list_courses(
    State(state): State<DBState>,
    Query(params): Query<CourseQueryParams>,
) -> Result<Json<PaginatedResponse<CourseResponse>>, ApiError> {
    let page = params.page();
    let per_page = params.per_page();

    let mut query = Entity::find();

    if let Some(ref subject) = params.subject {
        query = query.filter(Column::Subject.contains(subject));
    }
    if let Some(ref level) = params.level {
        query = query.filter(Column::Level.eq(level));
    }
    if let Some(min_price) = params.min_price {
        query = query.filter(Column::HourlyPrice.gte(min_price));
    }
    if let Some(max_price) = params.max_price {
        query = query.filter(Column::HourlyPrice.lte(max_price));
    }

    query = query.order_by_asc(Column::Subject);

    let paginator = query.paginate(&state.db, per_page);
    let total = paginator.num_items().await?;
    let items = paginator.fetch_page(page - 1).await?;

    let data: Vec<CourseResponse> = items.into_iter().map(CourseResponse::from).collect();

    Ok(Json(PaginatedResponse::new(data, page, per_page, total)))
}

// Update
#[utoipa::path(
    put,
    path = "/api/courses/edit/{id}",
    params(("id" = i32, Path, description = "Course ID")),
    request_body = UpdateCourseRequest,
    responses(
        (status = 200, description = "Course updated", body = CourseResponse),
        (status = 404, description = "Course not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Courses"
)]
pub async fn update_course(
    State(state): State<DBState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateCourseRequest>,
) -> Result<Json<CourseResponse>, ApiError> {
    payload.validate()?;

    let existing = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Course {} not found", id)))?;

    let mut active: ActiveModel = existing.into();

    if let Some(subject) = payload.subject {
        active.subject = Set(subject);
    }
    if let Some(hourly_price) = payload.hourly_price {
        active.hourly_price = Set(hourly_price);
    }
    if let Some(level) = payload.level {
        active.level = Set(Some(level));
    }
    if let Some(description) = payload.description {
        active.description = Set(Some(description));
    }

    let result = active.update(&state.db).await?;

    Ok(Json(CourseResponse::from(result)))
}

// Delete
#[utoipa::path(
    delete,
    path = "/api/courses/delete/{id}",
    params(("id" = i32, Path, description = "Course ID")),
    responses(
        (status = 204, description = "Course deleted"),
        (status = 404, description = "Course not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "Courses"
)]
pub async fn delete_course(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, ApiError> {
    let result = Entity::delete_by_id(id).exec(&state.db).await?;

    if result.rows_affected == 0 {
        return Err(ApiError::NotFound(format!("Course {} not found", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}
