use axum::Router;
use axum::routing::{get, post};
use crate::DBState;
use crate::server::fn_path;

pub fn path(state: DBState) -> Router{
    Router::new()
        .route("/", get(fn_path::home_page))
        .route("/api/all-courses", get(fn_path::all_courses))
        .route("/api/course/{id}", get(fn_path::course))
        .route("/api/users/create", post(fn_path::create_user))
        // .route("/api/users/login", get(fn_path::login_user))
        // .route("/api/users/all", get(fn_path::all_user))
        // .route("/api/users/{id}", get(fn_path::profile_user))
        // .route("/api/users/edit/{id}", get(fn_path::profile_user))
        .with_state(state)
}