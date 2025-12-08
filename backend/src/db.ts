import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:1234@localhost:5432/todo_db";

export const pool = new Pool({
  connectionString,
});
