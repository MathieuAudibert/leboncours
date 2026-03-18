use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use std::time::Duration;
use std::env;

pub async fn connect() -> DatabaseConnection {
    let db_url = env::var("DATABASE_URL").expect("Database is not set");

    let mut opt = ConnectOptions::new(db_url);
    opt.max_connections(10)
        .min_connections(2)
        .connect_timeout(Duration::from_secs(5))
        .idle_timeout(Duration::from_secs(600))
        .acquire_timeout(Duration::from_secs(10));

    println!("Connecting to the database");
    Database::connect(opt).await.expect("Cannot connect to DB")
}