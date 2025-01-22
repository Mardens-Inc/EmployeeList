use crate::employees_database;
use actix_web::{get, post, web, Error, HttpResponse};
use filemaker_lib::Filemaker;
use log::info;
use serde_json::{json, Value};
use std::collections::HashMap;

#[derive(serde::Deserialize)]
struct GetEmployeesQueryOptions {
    page: Option<u32>,
    limit: Option<u32>,
}

#[get("/")]
pub async fn get_employees(
    query: web::Query<GetEmployeesQueryOptions>,
) -> Result<HttpResponse, Error> {
    let (page, limit) = match (query.page, query.limit) {
        (Some(page), Some(limit)) => (page, limit),
        _ => (1, 10),
    };

    let employees = employees_database::get_employees(page, limit)
        .await
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to get employees: {}", err))
        })?;

    Ok(HttpResponse::Ok().json(employees))
}

#[get("/all")]
pub async fn get_all_employees() -> Result<HttpResponse, Error> {
    let employees = employees_database::get_all_employees()
        .await
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to get employees: {}", err))
        })?;
    Ok(HttpResponse::Ok().json(employees))
}

#[get("/{id}")]
pub async fn get_employee(id: web::Path<String>) -> Result<HttpResponse, Error> {
    let employee = employees_database::get_employee(id.into_inner().parse().unwrap())
        .await
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to get employee: {}", err))
        })?;
    Ok(HttpResponse::Ok().json(employee))
}

#[get("/search")]
pub async fn search_employees(
    query: web::Query<HashMap<String, String>>,
) -> Result<HttpResponse, Error> {
    // Extract the specific query parameter
    let query_param = query
        .get("q")
        .ok_or_else(|| actix_web::error::ErrorBadRequest("Missing 'query' parameter"))?
        .to_string();

    info!("Searching for employees with query: '{}'", query_param);

    let employees = employees_database::search_employees(query_param)
        .await
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!(
                "Failed to search employees: {}",
                err
            ))
        })?;
    Ok(HttpResponse::Ok().json(employees))
}

#[post("/import")]
pub async fn import_from_excel_file(body: web::Bytes) -> Result<HttpResponse, Error> {
    let path = "employees.xlsx";
    let bytes = body.to_vec();
    std::fs::write(path, bytes).map_err(|err| {
        actix_web::error::ErrorInternalServerError(format!("Failed to write file: {}", err))
    })?;

    employees_database::remove_employees()
        .await
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!(
                "Failed to remove employees: {}",
                err
            ))
        })?;

    let count = employees_database::import_from_excel_file(path)
        .await
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!(
                "Failed to import employees: {}",
                err
            ))
        })?;

    std::env::set_var("FM_URL", "https://fm.mardens.com/fmi/data/vLatest");
    let fm = Filemaker::new("admin", "19MRCC77!", "EmployeeSearch", "Employees")
        .await
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!(
                "Failed to connect to FileMaker: {}",
                err
            ))
        })?;
    fm.clear_database().await.map_err(|err| {
        actix_web::error::ErrorInternalServerError(format!("Failed to clear database: {}", err))
    })?;

    let employees = employees_database::get_all_employees().await?;

    for employee in employees {
        let mut record = HashMap::new();
        let employee_id = employee.id;
        let first_name = employee.first_name;
        let last_name = employee.last_name;

        record.insert("employee_ID".to_string(), Value::Number(employee_id.into()));
        record.insert("First".to_string(), Value::String(first_name));
        record.insert("Last".to_string(), Value::String(last_name));
        fm.add_record(record).await.map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to add record: {}", err))
        })?;
    }

    std::fs::remove_file(path).map_err(|err| {
        actix_web::error::ErrorInternalServerError(format!("Failed to remove file: {}", err))
    })?;

    Ok(HttpResponse::Ok().json(json!({"count": count})))
}

#[post("/import/krdp")]
pub async fn import_from_excel_file_krdp(body: web::Bytes) -> Result<HttpResponse, Error> {
    let path = "krdp.xlsx";
    let bytes = body.to_vec();
    std::fs::write(path, bytes).map_err(|err| {
        actix_web::error::ErrorInternalServerError(format!("Failed to write file: {}", err))
    })?;

    employees_database::remove_krdp().await.map_err(|err| {
        actix_web::error::ErrorInternalServerError(format!("Failed to remove employees: {}", err))
    })?;

    let count = employees_database::import_from_excel_file(path)
        .await
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!(
                "Failed to import employees: {}",
                err
            ))
        })?;

    std::fs::remove_file(path).map_err(|err| {
        actix_web::error::ErrorInternalServerError(format!("Failed to remove file: {}", err))
    })?;

    Ok(HttpResponse::Ok().json(json!({"count": count} )))
}

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(get_employees)
        .service(search_employees)
        .service(get_all_employees)
        .service(import_from_excel_file)
        .service(import_from_excel_file_krdp)
        .service(get_employee);
}
