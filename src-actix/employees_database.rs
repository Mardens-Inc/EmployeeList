use sqlx::MySqlPool;
use std::error::Error;

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