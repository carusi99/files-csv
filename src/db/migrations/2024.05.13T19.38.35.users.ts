import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  return params.context.query(`CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER CHECK (age > 0),
    role VARCHAR(20) NOT NULL DEFAULT 'user'
);
`);
};

export const down: Migration = async (params) => {
  return params.context.query(`DROP TABLE users;`);
};