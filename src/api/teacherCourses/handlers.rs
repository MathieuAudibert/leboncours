use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, Set};
use validator::Validate;
use super::dto::{CreateTeacherCourseRequest, UpdateTeacherCourseRequest, TeacherCourseQueryParams, TeacherCourseResponse};
use crate::api::common::PaginatedResponse;
use crate::api::error::ApiError;
use crate::DBState;
use crate::entities::teachercourses::{ActiveModel, Column, Entity};

// Create
#[utoipa::path(
    post,
    path = "/api/teacher-courses/create",
    request_body = CreateTeacherCourseRequest,
    responses(
        (status = 201, description = "TeacherCourse created", body = TeacherCourseResponse),
        (status = 400, description = "Validation error", body = crate::api::error::ErrorResponse)
    ),
    tag = "TeacherCourses"
)]
pub async fn create_teacher_course(
    State(state): State<DBState>,
    Json(payload): Json<CreateTeacherCourseRequest>,
) -> Result<(StatusCode, Json<TeacherCourseResponse>), ApiError> {
    payload.validate()?;

    let model = ActiveModel {
        teacher_id: Set(payload.teacher_id),
        course_id: Set(payload.course_id),
        ..Default::default()
    };

    let result = model.insert(&state.db).await?;

    Ok((StatusCode::CREATED, Json(TeacherCourseResponse::from(result))))
}

// Get by ID
#[utoipa::path(
    get,
    path = "/api/teacher-courses/{id}",
    params(("id" = i32, Path, description = "TeacherCourse ID")),
    responses(
        (status = 200, description = "TeacherCourse found", body = TeacherCourseResponse),
        (status = 404, description = "TeacherCourse not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "TeacherCourses"
)]
pub async fn get_teacher_course_by_id(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<Json<TeacherCourseResponse>, ApiError> {
    let result = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("TeacherCourse {} not found", id)))?;

    Ok(Json(TeacherCourseResponse::from(result)))
}

// List
#[utoipa::path(
    get,
    path = "/api/teacher-courses/all",
    params(TeacherCourseQueryParams),
    responses(
        (status = 200, description = "List of teacher courses", body = PaginatedResponse<TeacherCourseResponse>)
    ),
    tag = "TeacherCourses"
)]
pub async fn list_teacher_courses(
    State(state): State<DBState>,
    Query(params): Query<TeacherCourseQueryParams>,
) -> Result<Json<PaginatedResponse<TeacherCourseResponse>>, ApiError> {
    let page = params.page();
    let per_page = params.per_page();

    let mut query = Entity::find();

    if let Some(teacher_id) = params.teacher_id {
        query = query.filter(Column::TeacherId.eq(teacher_id));
    }
    if let Some(course_id) = params.course_id {
        query = query.filter(Column::CourseId.eq(course_id));
    }

    query = query.order_by_asc(Column::Id);

    let paginator = query.paginate(&state.db, per_page);
    let total = paginator.num_items().await?;
    let items = paginator.fetch_page(page - 1).await?;

    let data: Vec<TeacherCourseResponse> = items.into_iter().map(TeacherCourseResponse::from).collect();

    Ok(Json(PaginatedResponse::new(data, page, per_page, total)))
}

// Update
#[utoipa::path(
    put,
    path = "/api/teacher-courses/edit/{id}",
    params(("id" = i32, Path, description = "TeacherCourse ID")),
    request_body = UpdateTeacherCourseRequest,
    responses(
        (status = 200, description = "TeacherCourse updated", body = TeacherCourseResponse),
        (status = 404, description = "TeacherCourse not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "TeacherCourses"
)]
pub async fn update_teacher_course(
    State(state): State<DBState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateTeacherCourseRequest>,
) -> Result<Json<TeacherCourseResponse>, ApiError> {
    payload.validate()?;

    let existing = Entity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("TeacherCourse {} not found", id)))?;

    let mut active: ActiveModel = existing.into();

    if let Some(teacher_id) = payload.teacher_id {
        active.teacher_id = Set(Some(teacher_id));
    }
    if let Some(course_id) = payload.course_id {
        active.course_id = Set(Some(course_id));
    }

    let result = active.update(&state.db).await?;

    Ok(Json(TeacherCourseResponse::from(result)))
}

// Delete
#[utoipa::path(
    delete,
    path = "/api/teacher-courses/delete/{id}",
    params(("id" = i32, Path, description = "TeacherCourse ID")),
    responses(
        (status = 204, description = "TeacherCourse deleted"),
        (status = 404, description = "TeacherCourse not found", body = crate::api::error::ErrorResponse)
    ),
    tag = "TeacherCourses"
)]
pub async fn delete_teacher_course(
    State(state): State<DBState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, ApiError> {
    let result = Entity::delete_by_id(id).exec(&state.db).await?;

    if result.rows_affected == 0 {
        return Err(ApiError::NotFound(format!("TeacherCourse {} not found", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}
