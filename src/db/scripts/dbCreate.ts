import { adminClient } from "..";
import { configDotenv } from "dotenv";

if (process.env["NODE_ENV"] === "test") {
  console.log("Creando base de datos de prueba");
  configDotenv({ path: ".env.test" });
  console.log(process.env["PGDATABASE"])
} else {
  configDotenv();
}

const dbName = process.env["PGDATABASE"];

adminClient.connect();

adminClient.query(`CREATE DATABASE "${dbName}"`, (err) => {
  if (err) {
    console.error("Error al crear la base de datos", err.stack);
  } else {
    console.log(`Base de datos "${dbName}" creada exitosamente`);
  }
  adminClient.end();
});
