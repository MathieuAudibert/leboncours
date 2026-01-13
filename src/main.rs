mod server;

#[tokio::main]
async fn main() {

//     Calling the server
    server::server().await;
}

