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

