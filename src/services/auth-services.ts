import { User, UserParams } from "../models/auth-models";
import * as db from "../data/auth-data";
import * as bcrypt from "bcrypt";
import { ApiError } from "../middlewares/error";



//VALIDAR CREDENCIALES
export async function validateCredentials(
    credentials: UserParams
  ): Promise<User> {
    const { name, password } = credentials;
    if (name === undefined) {
        throw new Error("El nombre de usuario no está definido.");
      }    
    const user = await db.getUserByName(name);
    if (!user) {
      throw new ApiError("Credenciales incorrectas", 400);
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiError("Credenciales incorrectas", 400);
    }
    return user;
  }