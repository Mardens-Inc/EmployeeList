use calamine::{DataType, Reader, Xlsx};
use sqlx::MySqlPool;
use std::error::Error;
use std::path::Path;

#[derive(Debug, sqlx::FromRow, serde::Serialize)]
pub struct Employee {
	pub id: i32,
	pub first_name: String,
	pub last_name: String,
	pub location: String,
}

pub async fn initialize_db() -> Result<(), Box<dyn Error>> {
	let pool = create_connection().await?;
	sqlx::query(
		"
				CREATE TABLE IF NOT EXISTS employees
				(
					id         INT          NOT NULL PRIMARY KEY,
					first_name VARCHAR(100) NOT NULL,
					last_name  VARCHAR(100) NOT NULL,
					location   VARCHAR(100) NOT NULL
				);"
	)
		.execute(&pool)
		.await?;
	Ok(())
}

async fn create_connection() -> Result<MySqlPool, Box<dyn Error>> {
	let pool = MySqlPool::connect("mysql://drew:9bc9f6b264724051@localhost/stores")
		.await?;
	Ok(pool)
}

#[derive(Debug, serde::Serialize)]
pub struct EmployeeResponse {
	employees: Vec<Employee>,
	last_page: u32,
	count: usize,
}

pub async fn get_employees(page: u32, limit: u32) -> Result<EmployeeResponse, Box<dyn Error>> {
	let pool = create_connection().await?;
	let offset = page * limit;

	// Get employees with pagination
	let employees = sqlx::query_as::<_, Employee>(
		"SELECT * FROM employees LIMIT ? OFFSET ?"
	)
		.bind(limit as i64)
		.bind(offset as i64)
		.fetch_all(&pool)
		.await?;

	// Get total count of employees
	let total_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM employees")
		.fetch_one(&pool)
		.await?;

	let last_page = (total_count.0 as f64 / limit as f64).floor() as u32;
	let count = employees.len();

	Ok(EmployeeResponse {
		employees,
		last_page,
		count,
	})
}

pub async fn get_employee(id: i32) -> Result<Employee, Box<dyn Error>> {
	let pool = create_connection().await?;
	let employee = sqlx::query_as::<_, Employee>("SELECT * FROM employees WHERE id = ?")
		.bind(id)
		.fetch_one(&pool)
		.await?;
	Ok(employee)
}

pub async fn get_all_employees() -> Result<Vec<Employee>, Box<dyn Error>> {
	let pool = create_connection().await?;
	let employees = sqlx::query_as::<_, Employee>("SELECT * FROM employees")
		.fetch_all(&pool)
		.await?;
	Ok(employees)
}

pub async fn search_employees(query: impl AsRef<str>) -> Result<Vec<Employee>, Box<dyn Error>> {
	let pool = create_connection().await?;
	let employees = sqlx::query_as::<_, Employee>("select * from employees where concat_ws(' ',lower(first_name), lower(last_name), lower(location), lower(id)) like ?")
		.bind(format!("%{}%", query.as_ref().to_lowercase()))
		.fetch_all(&pool)
		.await?;
	Ok(employees)
}

pub async fn import_from_excel_file(path: impl AsRef<Path>) -> Result<u32, Box<dyn Error>>
{
	let pool = create_connection().await?;
	let mut workbook: Xlsx<_> = calamine::open_workbook(path)?;
	let range = workbook.worksheet_range("report")?;
	let rows: Vec<_> = range.rows().skip(1).collect();
	let chunk_size = 50;

	for chunks in rows.chunks(chunk_size) {
		let mut query = String::from("INSERT INTO employees (id, first_name, last_name, location) VALUES ");
		let mut bindings: Vec<String> = Vec::new();

		for (index, chunk) in chunks.iter().enumerate() {
			if chunk.is_empty() {
				continue;
			}

			let id: u64 = chunk[0].get_float().ok_or("Missing id")?.round() as u64;
			let first_name = chunk[1].get_string().ok_or("Missing first name")?.to_string();
			let last_name = chunk[2].get_string().ok_or("Missing last name")?.to_string();
			let location = chunk[3].get_string().ok_or("Missing location")?.to_string();

			if index > 0 {
				query.push_str(", ");
			}
			query.push_str("(?, ?, ?, ?)");
			bindings.push(id.to_string());
			bindings.push(first_name);
			bindings.push(last_name);
			bindings.push(location);
		}

		let mut query_builder = sqlx::query(&query);
		for binding in bindings {
			query_builder = query_builder.bind(binding);
		}

		query_builder.execute(&pool).await?;
	}

	Ok((range.rows().count() - 1) as u32)
}

pub async fn remove_employees() -> Result<(), Box<dyn Error>> {
	let pool = create_connection().await?;
	sqlx::query("DELETE FROM employees where location != 'krdp'")
		.execute(&pool)
		.await?;
	Ok(())
}

pub async fn remove_krdp() -> Result<(), Box<dyn Error>> {
	let pool = create_connection().await?;
	sqlx::query("DELETE FROM employees where location = 'krdp'")
		.execute(&pool)
		.await?;
	Ok(())
}