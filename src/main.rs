use dotenvy::dotenv;
mod server;
mod database;

#[derive(Clone)] // Cloner le pointeur de la DB
pub struct DBState {
    pub db: sea_orm::DatabaseConnection,
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let db_conn = database::connect().await;
    let state = DBState { db: db_conn };

    // Calling the server
    server::server_path(state).await;
}

