mod asset_endpoint;
mod employees_database;
mod employees_endpoint;

use crate::asset_endpoint::{start_vite_server, AppConfig};
use actix_web::dev::Service;
use actix_web::http::header::ACCESS_CONTROL_ALLOW_HEADERS;
use actix_web::{middleware, web, App, HttpResponse, HttpServer};
use awc::http::header::ACCESS_CONTROL_ALLOW_ORIGIN;
use log::info;
use serde_json::json;

pub static DEBUG: bool = cfg!(debug_assertions);
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "trace");
    env_logger::init();
    match employees_database::initialize_db().await {
        Ok(_) => info!("Database initialized"),
        Err(err) => {
            info!("Failed to initialize database: {}", err);
            return Ok(());
        }
    }

    let port = 1420; // Port to listen on
    let config = if cfg!(debug_assertions) {
        "development"
    } else {
        "production"
    };

    let server = HttpServer::new(move || {
        let app = App::new()
            .wrap(middleware::Logger::default())
            .wrap_fn(|req, srv| {
                // disable cors
                let fut = srv.call(req);
                async {
                    let mut res = fut.await?;
                    res.headers_mut()
                        .insert(ACCESS_CONTROL_ALLOW_HEADERS, "*".parse().unwrap());
                    res.headers_mut()
                        .insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
                    Ok(res)
                }
            })
            .app_data(
                web::JsonConfig::default()
                    .limit(4096)
                    .error_handler(|err, _req| {
                        let error = json!({ "error": format!("{}", err) });
                        actix_web::error::InternalError::from_response(
                            err,
                            HttpResponse::BadRequest().json(error),
                        )
                        .into()
                    }),
            )
            .service(web::scope("api").configure(employees_endpoint::configure));
        app.configure_routes()
    })
    .workers(4)
    .bind(format!("0.0.0.0:{port}", port = port))?
    .run();

    // Start the Vite server in development mode
    if DEBUG {
        start_vite_server().expect("Failed to start vite server");
    }
    info!("Starting {} server at http://127.0.0.1:{}...", config, port);
    server.await
}
