use axum::{routing::get, Router};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;
use crate::DBState;

mod path;

const ADDRESS: &str = "127.0.0.1:3000";

pub async fn server_path(state: DBState) {
    let router = Router::new()
        .route("/", get(path::home_page))
        .route("/convert", get(path::convert))
        .route("/result", get(path::result))
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", path::ApiDoc::openapi()))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(ADDRESS).await.unwrap();

    println!("Serveur : http://{}", ADDRESS);
    axum::serve(listener, router).await.unwrap();
}