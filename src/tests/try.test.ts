import { describe, beforeEach, it, expect } from "vitest";
import request from "supertest";
import { truncateTable } from "../db/utils";
import { app } from "../app";
import * as db from "../db";
const jwt = require("jsonwebtoken");
const jwtSecret = "ultra-mega-secret";

const testClients = [
  {
    id: 1,
    name: "usuario 1",
    email: "prueba@mail.com",
    age: "20",
    role: "user"
  },
  {
    id: 2,
    name: "usuario 2",
    email: "prueba@mail.com",
    age: "30",
    role: "user"
  },
];

const testUsers = [
  {
    id: 1,
    name: "usuario 1",
    password: "usuario1",
    email: "prueba@mail.com",
    age: "20",
    role: "user"
  },
  {
    id: 2,
    name: "usuario 2",
    email: "prueba@mail.com",
    password: "usuario2",
    age: "30",
    role: "user"
  },
];

//CLIENT TABLE:
beforeEach(async () => {
  await truncateTable("client");
  const values = testClients
    .map(
      (user) =>
        `('${user.name}','${user.email}','${user.age}','${user.role}')`
    )
    .join(", ");
  let query = `INSERT INTO client (name, email, age, role) VALUES ${values} RETURNING *`;

  await db.query(query);
});

//USERS TABLE:
describe("users API", () => {
  beforeEach(async () => {
    await truncateTable("users");
    const values = testUsers
      .map((users) => `('${users.name}','${users.password}','${users.email}', '${users.age}', '${users.role}' )`)
      .join(", ");
    let query = `INSERT INTO users (name, password, email, age, role) VALUES ${values} RETURNING id,content,createdat,updatedat,(SELECT u.username FROM users AS u WHERE u.id =posts.userid) AS username, 0 AS likesCount`;

    await db.query(query);
  });
})