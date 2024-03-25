import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST, // Your PostgreSQL host
  port: Number(process.env.DATABASE_PORT), // Your PostgreSQL port (default is 5432)
  username: process.env.DATABASE_USER, // Your PostgreSQL username
  password: process.env.DATABASE_PASSWORD, // Your PostgreSQL password
  database: process.env.DATABASE_NAME, // Your PostgreSQL database name
  schema: "public",
  poolSize: 10,
});
