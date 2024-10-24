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

pub async fn get_employees() -> Result<Vec<Employee>, Box<dyn Error>> {
	let pool = create_connection().await?;
	let employees = sqlx::query_as::<_, Employee>(
		"SELECT id, first_name, last_name, location FROM employees"
	)
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
	let range = workbook.worksheet_range("Sheet1")?;
	let mut count = 0;
	for row in range.rows() {
		let id = row[0].get_string().unwrap().parse::<i32>()?;
		let first_name = row[1].get_string().unwrap();
		let last_name = row[2].get_string().unwrap();
		let location = row[3].get_string().unwrap();

		sqlx::query(
			"INSERT INTO employees (id, first_name, last_name, location) VALUES (?, ?, ?, ?)"
		)
			.bind(id)
			.bind(first_name)
			.bind(last_name)
			.bind(location)
			.execute(&pool)
			.await?;
		count += 1;
	}
	Ok(count)
}