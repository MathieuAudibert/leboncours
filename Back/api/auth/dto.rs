use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;
use crate::entities::sea_orm_active_enums::UsersRole;

// Register
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct RegisterRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: String,
    #[validate(length(min = 1, max = 255))]
    pub firstname: String,
    #[validate(email, length(max = 255))]
    pub email: String,
    pub role: UsersRole,
    #[validate(length(min = 8, max = 255))]
    pub password: String,
}

// Login
#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 1))]
    pub password: String,
}

// Auth Response (retourne le JWT)
#[derive(Debug, Serialize, ToSchema)]
pub struct AuthResponse {
    pub token: String,
    pub user: AuthUserInfo,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct AuthUserInfo {
    pub id: i32,
    pub name: String,
    pub firstname: String,
    pub email: String,
    pub role: String,
}

impl From<crate::entities::users::Model> for AuthUserInfo {
    fn from(model: crate::entities::users::Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            firstname: model.firstname,
            email: model.email,
            role: model.role.to_string(),
        }
    }
}
