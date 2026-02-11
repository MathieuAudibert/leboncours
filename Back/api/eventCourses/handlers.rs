use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, Set};
use sea_orm::prelude::DateTime;
use validator::Validate;
use super::dto::{CreateEventCourseRequest, UpdateEventCourseRequest, EventCourseQueryParams, EventCourseResponse};
use crate::api::common::PaginatedResponse;
use crate::api::error::ApiError;
use crate::entities::sea_orm_active_enums::EventState;
use crate::DBState;
use crate::entities::eventcourses::{ActiveModel, Column, Entity};

fn parse_datetime(s: &str) -> Result<DateTime, ApiError> {
    chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%dT%H:%M:%S")
        .or_else(|_| chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S"))
        .map_err(|_| ApiError::ValidationError(format!("Invalid datetime format: {}, expected YYYY-MM-DDTHH:MM:SS", s)))
}

// Create
#[utoipa::path(
    post,
    path = "/api/event-courses/create",
    request_body = CreateEventCourseRequest,
    responses(
        (status = 201, description = "EventCourse created", body = EventCourseResponse),
        (status = 400, description = "Validation error", body = crate::api::error::ErrorResponse)
    ),
    tag = "EventCourses"
)]
pub async fn create_event_course(
    State(state): State<DBState>,
    Json(payload): Json<CreateEventCourseRequest>,
) -> Result<(StatusCode, Json<EventCourseResponse>), ApiError> {
    payload.validate()?;

    let dates = payload.dates.as_deref().map(parse_datetime).transpose()?;

    let model = ActiveModel {
        student_id: Set(payload.student_id),
        course_id: Set(payload.course_id),
        dates: Set(dates),
        state: Set(payload.state.unwrap_or(EventState::Pending)),
        ..Default::default()
    };

    let result = model.insert(&state.db).await?;

    Ok((StatusCode::CREATED, Json(EventCourseResponse::from(result))))
}

// Get by ID
#[utoipa::path(
    get,
    path = "/api/event-courses/{id}",
    params(("id" = i32, Path, description = "EventCourse ID")),
    responses(
        (status = 200, description = "EventCourse found", body = EventCourseResponse),
        (status = 404, description = "EventCourse not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "EventCourses"
)]
pub async fn get_event_course_by_id(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<Json<EventCourseResponse>, ApiError> {
    let result = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("EventCourse {} not found", id)))?;

    Ok(Json(EventCourseResponse::from(result)))
}

// List
#[utoipa::path(
    get,
    path = "/api/event-courses/all",
    params(EventCourseQueryParams),
    responses(
        (status = 200, description = "List of event courses", body = PaginatedResponse<EventCourseResponse>)
    ),
    tag = "EventCourses"
)]
pub async fn list_event_courses(
    State(state): State<DBState>,
    Query(params): Query<EventCourseQueryParams>,
) -> Result<Json<PaginatedResponse<EventCourseResponse>>, ApiError> {
    let page = params.page();
    let per_page = params.per_page();

    let mut query = Entity::find();

    if let Some(student_id) = params.student_id {
        query = query.filter(Column::StudentId.eq(student_id));
    }
    if let Some(course_id) = params.course_id {
        query = query.filter(Column::CourseId.eq(course_id));
    }
    if let Some(ref event_state) = params.state {
        query = query.filter(Column::State.eq(event_state));
    }

    query = query.order_by_desc(Column::Dates);

    let paginator = query.paginate(&state.db, per_page);
    let total = paginator.num_items().await?;
    let items = paginator.fetch_page(page - 1).await?;

    let data: Vec<EventCourseResponse> = items.into_iter().map(EventCourseResponse::from).collect();

    Ok(Json(PaginatedResponse::new(data, page, per_page, total)))
}

// Update
#[utoipa::path(
    put,
    path = "/api/event-courses/edit/{id}",
    params(("id" = i32, Path, description = "EventCourse ID")),
    request_body = UpdateEventCourseRequest,
    responses(
        (status = 200, description = "EventCourse updated", body = EventCourseResponse),
        (status = 404, description = "EventCourse not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "EventCourses"
)]
pub async fn update_event_course(
    State(state): State<DBState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateEventCourseRequest>,
) -> Result<Json<EventCourseResponse>, ApiError> {
    payload.validate()?;

    let existing = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("EventCourse {} not found", id)))?;

    let mut active: ActiveModel = existing.into();

    if let Some(student_id) = payload.student_id {
        active.student_id = Set(Some(student_id));
    }
    if let Some(course_id) = payload.course_id {
        active.course_id = Set(Some(course_id));
    }
    if let Some(ref dates) = payload.dates {
        active.dates = Set(Some(parse_datetime(dates)?));
    }
    if let Some(event_state) = payload.state {
        active.state = Set(event_state);
    }

    let result = active.update(&state.db).await?;

    Ok(Json(EventCourseResponse::from(result)))
}

// Delete
#[utoipa::path(
    delete,
    path = "/api/event-courses/delete/{id}",
    params(("id" = i32, Path, description = "EventCourse ID")),
    responses(
        (status = 204, description = "EventCourse deleted"),
        (status = 404, description = "EventCourse not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "EventCourses"
)]
pub async fn delete_event_course(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, ApiError> {
    let result = Entity::delete_by_id(id).exec(&state.db).await?;

    if result.rows_affected == 0 {
        return Err(ApiError::NotFound(format!("EventCourse {} not found", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}
