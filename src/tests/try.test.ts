import { describe, beforeEach, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app";
const jwt = require("jsonwebtoken");
const jwtSecret = "ultra-mega-secret";


describe('POST /login', () => {
    it('should login user and return a valid JWT token', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const res = await request(app)
        .post('/login')
        .send(userData)
        .expect(200);

      expect(res.body.ok).toBe(true);
      expect(res.body.message).toBe('Login exitoso');
      expect(res.body.data.token).toBeDefined();
      // You can add more assertions here to ensure the token is valid
    });

   