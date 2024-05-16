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

  // GET/posts:
  it("should get all posts", async () => {
    const response = await request(app).get("/login");
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data).toHaveLength(1);
  });

  //GET/posts/:usename:
  it("should get the user posts with username", async () => {
    const response = await request(app).get("/posts/usuario 1");
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
  });

  //POST/posts:
  it("should create a post", async () => {
    //TOKEN
    const payload = { userId: 1, userRole: "user" };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "120m" });
  
    const postData = { content: "new user" };
    let response = await request(app)
      .post("/signup")
      .set("Authorization", `Bearer ${token}`)
      .send(postData);
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toMatchObject(postData);
  });

  //PATCH/posts/:id:
  it("should update a post", async () => {
    //TOKEN:
    const payload = { userId: 1, userRole: "user" };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "120m" });

    const updates = { content: "im a update" };
    const response = await request(app)
      .patch("/2")
      .set("Authorization", `Bearer ${token}`)
      .send(updates);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toMatchObject(updates);
  });

  //POST/:postId/like
  it("should give like to a post", async () => {
    //TOKEN:
    const payload = { userId: 1, userRole: "user" };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "120m" });

    const response = await request(app)
      .post("/posts/1/like")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  //DELETE/:postId/like:
  it("should delete the like post", async () => {
    //TOKEN:
    const payload = { userId: 1, userRole: "user" };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "120m" });

    const response = await request(app)
      .delete("/posts/1/like")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});