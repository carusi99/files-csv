import { configDotenv } from "dotenv";
import { query, pool } from "..";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

query(`
-- Insertar datos de ejemplo en la tabla users
INSERT INTO users (name, password, email, age, role)
SELECT
    'user' || s.id, -- Genera un nombre de usuario concatenando una cadena con el ID
    'password' || s.id, -- Genera una contraseña concatenando una cadena con el ID
    'user' || s.id || '@example.com', -- Genera un correo electrónico concatenando una cadena con el ID
    s.id % 50 + 18, -- Genera una edad aleatoria entre 18 y 67 (50 + 18)
    CASE 
        WHEN s.id % 5 = 0 THEN 'admin'
        ELSE 'user'
    END -- Asigna roles de manera aleatoria
FROM generate_series(1, 50) AS s(id);
  `).then(() => {
  console.log("inserted users");
  pool.end();
});