use axum::extract::{Path, State};
use axum::Json;
use serde::{Deserialize, Serialize};
use utoipa::{OpenApi, ToSchema};
use crate::{api, DBState};
use crate::entities::users::Entity;

#[derive(Serialize, Deserialize, ToSchema)]
pub struct CreateUserRequest {
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub role: UserRole,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bio: Option<String>,
}

#[derive(Serialize, Deserialize, ToSchema)]
pub enum UserRole {
    Admin,
    Student,
    Teacher,
}

#[utoipa::path(get, path = "/", responses((status = 200, description = "Page d'accueil")))]
pub async fn home_page() -> &'static str {
    "Home"
}

#[utoipa::path(get, path = "/api/all-courses", responses((status = 200, description = "Récupère la liste des cours")))]
pub async fn all_courses() -> &'static str {
    "All Courses"
}

#[utoipa::path(get, path = "/api/course/{id}", responses((status = 200, description = "Détails du cours récupérés", body = String)),
    params(
        ("id" = u32, Path, description = "L'identifiant unique du cours")
    )
)]
pub async fn course (State(_state): State<DBState>,Path(id): Path<u32>) -> String {
    format!("Tu as demandé l'utilisateur avec l'ID : {}", id)
}

#[utoipa::path(
    post,
    path = "/api/users/create",
    request_body = CreateUserRequest,
    responses(
        (status = 201, description = "Utilisateur créé avec succès", body = String),
        (status = 400, description = "Données invalides")
    )
)]
pub async fn create_user(
    State(_state): State<DBState>,
    Json(user): Json<CreateUserRequest>
) -> String {
    api::users::create_user();
}


#[derive(OpenApi)]
#[openapi(
    paths(home_page, all_courses, course, create_user), // On liste tout ici
    components(schemas())
)]
pub struct ApiDoc;