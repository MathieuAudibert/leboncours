use axum::Router;
use axum::routing::{get, post, put, delete};
use crate::DBState;
use crate::server::fn_path;
use crate::api;

pub fn path(state: DBState) -> Router {
    Router::new()
        .route("/", get(fn_path::home_page))
        .route("/api/all-courses", get(fn_path::all_courses))
        .route("/api/course/{id}", get(fn_path::course))
        .route("/api/users/create", post(api::users::create_user))
        .route("/api/users/all", get(api::users::list))
        .route("/api/users/{id}", get(api::users::get_by_id))
        .route("/api/users/edit/{id}", put(api::users::update))
        .route("/api/users/delete/{id}", delete(api::users::delete))
        .with_state(state)
}