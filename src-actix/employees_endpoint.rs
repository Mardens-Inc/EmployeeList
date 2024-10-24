use crate::employees_database;
use actix_web::{get, post, web, Error, HttpResponse};
use log::info;
use std::collections::HashMap;

#[get("/")]
pub async fn get_employees() -> Result<HttpResponse, Error> {
	let employees = employees_database::get_employees().await.map_err(|err| {
		actix_web::error::ErrorInternalServerError(format!(
			"Failed to get employees: {}",
			err
		))
	})?;

	Ok(HttpResponse::Ok().json(employees))
}

#[get("/search")]
pub async fn search_employees(query: web::Query<HashMap<String, String>>) -> Result<HttpResponse, Error> {
	// Extract the specific query parameter
	let query_param = query.get("query").ok_or_else(|| {
		actix_web::error::ErrorBadRequest("Missing 'query' parameter")
	})?.to_string();

	info!("Searching for employees with query: '{}'", query_param);

	let employees = employees_database::search_employees(query_param).await.map_err(|err| {
		actix_web::error::ErrorInternalServerError(format!(
			"Failed to search employees: {}",
			err
		))
	})?;
	Ok(HttpResponse::Ok().json(employees))
}

#[post("/")]
pub async fn import_from_excel_file(body: web::Bytes) -> Result<HttpResponse, Error> {
	let path = "employees.xlsx";
	let bytes = body.to_vec();
	std::fs::write(path, bytes).map_err(|err| {
		actix_web::error::ErrorInternalServerError(format!(
			"Failed to write file: {}",
			err
		))
	})?;

	let count = employees_database::import_from_excel_file(path).await.map_err(|err| {
		actix_web::error::ErrorInternalServerError(format!(
			"Failed to import employees: {}",
			err
		))
	})?;

	std::fs::remove_file(path).map_err(|err| {
		actix_web::error::ErrorInternalServerError(format!(
			"Failed to remove file: {}",
			err
		))
	})?;

	Ok(HttpResponse::Ok().json(format!("Imported {} employees", count)))
}