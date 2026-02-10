use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use std::time::Duration;
use std::env;

pub async fn connect() -> DatabaseConnection {
    let db_url = env::var("DATABASE_URL").expect("Database is not set");

    let mut opt = ConnectOptions::new(db_url);
    opt.max_connections(10)
        .connect_timeout(Duration::from_secs(5));

    println!("Connecting to the database");
    Database::connect(opt).await.expect("Cannot connect to DB")
}