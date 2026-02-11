use axum::{
    extract::State,
    http::StatusCode,
    Json,
};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, Set, ActiveModelTrait};
use validator::Validate;
use super::dto::{RegisterRequest, LoginRequest, AuthResponse, AuthUserInfo};
use super::jwt::create_token;
use crate::api::common::{hash_password, verify_password};
use crate::api::error::ApiError;
use crate::DBState;
use crate::entities::users::{Column, Entity, ActiveModel};

// Register
#[utoipa::path(
    post,
    path = "/api/auth/register",
    request_body = RegisterRequest,
    responses(
        (status = 201, description = "User registered successfully", body = AuthResponse),
        (status = 400, description = "Validation error", body = crate::api::error::ErrorResponse),
        (status = 409, description = "Email already exists", body = crate::api::error::ErrorResponse)
    ),
    tag = "Auth"
)]
pub async fn register(
    State(state): State<DBState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<(StatusCode, Json<AuthResponse>), ApiError> {
    payload.validate()?;

    // Vérifier si l'email existe déjà
    let existing = Entity::find()
        .filter(Column::Email.eq(&payload.email))
        .one(&state.db)
        .await?;

    if existing.is_some() {
        return Err(ApiError::Conflict("Email already exists".into()));
    }

    // Hasher le mot de passe
    let password_hash = hash_password(&payload.password)?;

    let model = ActiveModel {
        name: Set(payload.name),
        firstname: Set(payload.firstname),
        email: Set(payload.email),
        role: Set(payload.role),
        password: Set(password_hash),
        metadata: Set(None),
        ..Default::default()
    };

    let user = model.insert(&state.db).await?;

    // Générer le JWT
    let token = create_token(user.id, &user.email, &user.role.to_string())?;

    Ok((StatusCode::CREATED, Json(AuthResponse {
        token,
        user: AuthUserInfo::from(user),
    })))
}

// Login
#[utoipa::path(
    post,
    path = "/api/auth/login",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "Login successful", body = AuthResponse),
        (status = 400, description = "Validation error", body = crate::api::error::ErrorResponse),
        (status = 401, description = "Invalid credentials", body = crate::api::error::ErrorResponse)
    ),
    tag = "Auth"
)]
pub async fn login(
    State(state): State<DBState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, ApiError> {
    payload.validate()?;

    // Chercher l'utilisateur par email
    let user = Entity::find()
        .filter(Column::Email.eq(&payload.email))
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::Unauthorized("Invalid email or password".into()))?;

    // Vérifier le mot de passe
    let is_valid = verify_password(&payload.password, &user.password)?;
    if !is_valid {
        return Err(ApiError::Unauthorized("Invalid email or password".into()));
    }

    // Générer le JWT
    let token = create_token(user.id, &user.email, &user.role.to_string())?;

    Ok(Json(AuthResponse {
        token,
        user: AuthUserInfo::from(user),
    }))
}
