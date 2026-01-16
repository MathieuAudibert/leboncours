use axum::{Router};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;
use crate::DBState;

mod fn_path;
mod api_routes;

const ADDRESS: &str = "127.0.0.1:3000";

pub async fn server_path(state: DBState) {
    let app = Router::new()
        .merge(SwaggerUi::new("/swagger-ui")
            .url("/api-docs/openapi.json", fn_path::ApiDoc::openapi()))
        .merge(api_routes::path(state));

    let listener = tokio::net::TcpListener::bind(ADDRESS).await.unwrap();

    println!("Serveur: http://{}", ADDRESS);
    println!("Swagger: http://{}/swagger-ui/", ADDRESS);

    axum::serve(listener, app).await.unwrap();
}