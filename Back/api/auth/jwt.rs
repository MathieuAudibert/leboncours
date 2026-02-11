use axum::{
    async_trait,
    extract::FromRequestParts,
    http::request::Parts,
    response::IntoResponse,
};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use crate::api::error::ApiError;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    #[serde(rename = "sub")]
    pub user_id: i32,
    pub email: String,
    pub role: String,
    #[serde(rename = "exp")]
    pub expires_at: usize,
    #[serde(rename = "iat")]
    pub issued_at: usize,
}

fn get_jwt_secret() -> Result<String, ApiError> {
    std::env::var("JWT_SECRET")
        .map_err(|_| ApiError::InternalError("JWT_SECRET not set in environment".into()))
}

pub fn create_token(user_id: i32, email: &str, role: &str) -> Result<String, ApiError> {
    let secret = get_jwt_secret()?;

    let now = chrono::Utc::now();

    let claims = Claims {
        user_id,
        email: email.to_string(),
        role: role.to_string(),
        expires_at: (now + chrono::Duration::hours(24)).timestamp() as usize,
        issued_at: now.timestamp() as usize,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|e| ApiError::InternalError(format!("JWT creation error: {}", e)))
}

/// Décode et vérifie un JWT
pub fn verify_token(token: &str) -> Result<Claims, ApiError> {
    let secret = get_jwt_secret()?;

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map(|data| data.claims)
    .map_err(|e| ApiError::Unauthorized(format!("Invalid token: {}", e)))
}

/// injecte le user authentifié dans les handlers
#[derive(Debug, Clone)]
pub struct AuthUser {
    pub user_id: i32,
    pub email: String,
    pub role: String,
}

/// Rejection type pour AuthUser
pub struct AuthRejection(ApiError);

impl IntoResponse for AuthRejection {
    fn into_response(self) -> axum::response::Response {
        self.0.into_response()
    }
}

impl From<ApiError> for AuthRejection {
    fn from(err: ApiError) -> Self {
        AuthRejection(err)
    }
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = AuthRejection;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("Authorization")
            .and_then(|v| v.to_str().ok())
            .ok_or_else(|| ApiError::Unauthorized("Missing Authorization header".into()))?;

        let token = auth_header
            .strip_prefix("Bearer ")
            .ok_or_else(|| ApiError::Unauthorized("Invalid Authorization format, expected: Bearer <token>".into()))?;

        let claims = verify_token(token)?;

        Ok(AuthUser {
            user_id: claims.user_id,
            email: claims.email,
            role: claims.role,
        })
    }
}
