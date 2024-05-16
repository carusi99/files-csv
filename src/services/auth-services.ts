import * as bcrypt from "bcrypt";
import { User, UserParams } from "../models/auth-models";
import * as db from "../data/auth-data";
import { ApiError } from "../middlewares/error";

export async function createUser(data: UserParams): Promise<User> {
  const { email, password } = data;

  // Verificar la longitud de la contraseña
  if (password.length < 6) {
      throw new ApiError("La contraseña debe tener al menos 6 caracteres", 400);
  }

  // Verificar la existencia del usuario
  try {
      const user = await db.getUserByName(email);
      if (user) {
          throw new ApiError("El email ya está registrado", 400);
      }
  } catch (error) {
      throw new ApiError("Error al verificar la existencia del usuario", 500);
      
  }

  // Hashear la contraseña
  const costFactor = 10;
  const hashedPassword = await bcrypt.hash(password, costFactor);

  // Crear el nuevo usuario
  try {
      const newUser = await db.createUsers({ ...data, password: hashedPassword });
      return newUser;
  } catch (error) {
    console.error("Error al crear el usuario en la base de datos:", error);
      throw new ApiError("Error al crear el usuario", 500);
  }
}



//VALIDAR CREDENCIALES
export async function validateCredentials(
    credentials: UserParams
  ): Promise<User> {
    const { email, password } = credentials;  
    const user = await db.getUserByName(email);
    if (!user) {
      throw new ApiError("Credenciales inválidas", 400);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError("Credenciales inválidas", 400);
    }
    return user;
    }
