use axum::extract::{Path, State};
use utoipa::OpenApi;
use crate::DBState;

#[utoipa::path(get, path = "/", responses((status = 200, description = "Page d'accueil")))]
pub async fn home_page() -> &'static str {
    "Home"
}

#[utoipa::path(get, path = "/api/all-courses", responses((status = 200, description = "Récupère la liste des cours")))]
pub async fn all_courses() -> &'static str {
    "All Courses"
}

#[utoipa::path(
    get,
    path = "/api/course/{id}",
    responses(
        (status = 200, description = "Détails du cours récupérés", body = String)
    ),
    params(
        ("id" = u32, Path, description = "L'identifiant unique du cours")
    )
)]
pub async fn course (State(_state): State<DBState>,Path(id): Path<u32>) -> String {
    format!("Tu as demandé l'utilisateur avec l'ID : {}", id)
}

#[derive(OpenApi)]
#[openapi(
    paths(home_page, all_courses, course), // On liste tout ici
    components(schemas())
)]
pub struct ApiDoc;