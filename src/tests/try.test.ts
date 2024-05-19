import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app";
import path from "node:path";
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

    it('should return 400 for invalid login credentials', async () => {
      // Provide invalid login credentials
      const invalidUserData = { email: 'test@example.com', password: 'invalidpassword' };
      const res = await request(app)
        .post('/login')
        .send(invalidUserData)
        .expect(400);
         expect(res.body.ok).toBe(false);
    });
    //tests para ingresar correctamente un archivo csv
    it("should upload CSV file successfully", async () => {
      const payload = { userId: 1, userRole: "admin" };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "60m" });
      const filePath = path.join(__dirname, '../models/file.csv'); // Ruta al archivo CSV de prueba
  
      const res = await request(app)
        .post("/upload")
        .set("Authorization", `Bearer ${token}`)
        .attach("csvFile", filePath)
        .expect(200);
  
      expect(res.body.ok).toBeTruthy();
    });
  
//tests para no permitir el acceso a usuarios no autorizados
    it("should return 403 for unauthorized users", async () => {
      const payload = { userId: 1, userRole: "user" }; // Rol no autorizado
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "60m" });
    
      await request(app)
        .post("/upload")
        .set("Authorization", `Bearer ${token}`)
        .expect(403);
    });

  //tests para no permitir usuarios no autehticados a subir archivos 
    it("should return 401 for unauthenticated users", async () => {
      await request(app).post("/upload").expect(401);
    });

  });
