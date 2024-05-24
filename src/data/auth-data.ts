import { User, UserParams, UpdateUser } from "../models/auth-models";
import * as db from "../db";
import { ApiError } from "../middlewares/error";

//function para crear el usuario en signup
export async function createUsers(user: UserParams): Promise<User> {
  const query = `INSERT INTO users 
  (name, password, email, age, role) 
  VALUES ($1, $2, $3, $4, $5) 
  RETURNING id, name, password, email, age, role`;

  // Reemplazar los valores null por un valor por defecto
  const queryParams = [
    user.name || "",
    user.password,
    user.email || "",
    user.age || 1,
    user.role || "user",
  ];

  try {
    const result = await db.query(query, queryParams);

    // Verificar si se insertó correctamente y si se devolvieron los campos esperados
    if (result.rows.length === 0) {
      throw new ApiError("No se pudo insertar el usuario", 400);
    }

    // Devolver el usuario insertado con todos los campos
    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      password: "",
      age: result.rows[0].age,
      role: result.rows[0].role,
    };
  } catch (error) {
    console.error("Error al ejecutar la consulta SQL:", error);
    throw new ApiError("Error al insertar el usuario", 400);
  }
}

//OBTIENE EL USUARIO POR EL EMAIL
export async function getUserByName(email: string): Promise<User | undefined> {
  return (await db.query("SELECT * FROM users WHERE email=$1", [email]))
    .rows[0];
}

export async function deleteUser(id: number): Promise<User | undefined> {
  return (await db.query("DELETE FROM client WHERE id = $1 RETURNING *", [id]))
    .rows[0];
}

export async function editUser({
  id,
  fieldsToUpdate,
}: UpdateUser): Promise<User> {
  if (!id || Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No se proporcionaron datos para actualizar");
  }
  const allowedFields = ["email", "name", "age"]; // Lista de campos permitidos para actualizar
  const validFieldsToUpdate = Object.keys(fieldsToUpdate).filter((field) =>
    allowedFields.includes(field)
  );
  const setClauses = validFieldsToUpdate.map(
    (field, index) => `${field} = $${index + 1}`
  );
  const updateQuery = `UPDATE client SET ${setClauses.join(", ")} WHERE id = $${
    validFieldsToUpdate.length + 1
  } RETURNING *`;

  const params = [
    ...validFieldsToUpdate.map((field) => fieldsToUpdate[field]),
    id,
  ];
  const result = await db.query(updateQuery, params);

  return result.rows[0]; // Devuelve el usuario actualizado
}
