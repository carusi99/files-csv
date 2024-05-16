
import { Client, Pool } from "pg";
import { configDotenv } from "dotenv";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const pool = new Pool({
  host: process.env["PGHOST"],
  port: Number(process.env["PGPORT"]),
  database: process.env["PGDATABASE"],
  user: process.env["PGUSER"],
  password: process.env["PGPASSWORD"],
});

export const query = (text: string, params?: (string | number | boolean)[]) => {
  return pool.query(text, params);
};

export const adminClient = new Client({
  host: process.env["PGHOST"],
  port: Number(process.env["PGPORT"]),
  database: process.env["PGUSER"],
  user: process.env["PGUSER"],
  password: process.env["PGPASSWORD"],
});
