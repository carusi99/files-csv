import { User, UserParams } from "../models/auth-models";
import * as db from "../data/auth-data";
import * as bcrypt from "bcrypt";
import { ApiError } from "../middlewares/error";



//VALIDAR CREDENCIALES
export async function validateCredentials(
    credentials: UserParams
  ): Promise<User> {
    const { email, password } = credentials;  
    const user = await db.getUserByName(email);
    
    if (!user) {
      throw new ApiError("Credenciales incorrectas", 400);
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiError("Credenciales incorrectas", 400);
    }
    return user;
    
  }