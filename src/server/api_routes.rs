use axum::Router;
use axum::routing::get;
use crate::DBState;
use crate::server::fn_path;


pub fn path(state: DBState) -> Router{
    Router::new()
        .route("/", get(fn_path::home_page))
        .route("/api/skills", get(fn_path::all_courses))
        .route("/api/course/:id", get(fn_path::course))
        .with_state(state)
}