use utoipa::OpenApi;

#[utoipa::path(get, path = "/", responses((status = 200, description = "Page d'accueil")))]
pub async fn home_page() -> &'static str {
    "Home"
}

#[utoipa::path(get, path = "/convert", responses((status = 200, description = "Route de conversion")))]
pub async fn convert() -> &'static str {
    "Convert"
}

#[utoipa::path(get, path = "/result", responses((status = 200, description = "Affichage du résultat")))]
pub async fn result() -> &'static str {
    "Result"
}

#[derive(OpenApi)]
#[openapi(
    paths(home_page, convert, result), // On liste tout ici
    components(schemas())
)]
pub struct ApiDoc;