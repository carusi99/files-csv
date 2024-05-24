import * as bcrypt from "bcrypt";
import { User, UserParams } from "../models/auth-models";
import * as db from "../data/auth-data";
import { ApiError } from "../middlewares/error";

export async function createUser(data: UserParams): Promise<User> {
  const { email, password } = data;

  // Verificar la longitud de la contraseña
  if (password.length < 6) {
      throw new ApiError("The password must be at least 6 characters", 400);
  }

  // Verificar la existencia del usuario
  try {
      const user = await db.getUserByName(email);
      if (user) {
          throw new ApiError("The email is already registered", 400);
      }
  } catch (error) {
      throw new ApiError("Error verifying user existence", 500);
      
  }

  // Hashear la contraseña
  const costFactor = 10;
  const hashedPassword = await bcrypt.hash(password, costFactor);

  // Crear el nuevo usuario
  try {
      const newUser = await db.createUsers({ ...data, password: hashedPassword });
      return newUser;
  } catch (error) {
    console.error("Error creating user in database:", error);
      throw new ApiError("Error creating user", 500);
  }
}



//VALIDAR CREDENCIALES
export async function validateCredentials(
    credentials: UserParams
  ): Promise<User> {
    const { email, password } = credentials;  
    const user = await db.getUserByName(email);
    if (!user) {
      throw new ApiError("Invalid credentials", 400);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError("Invalid credentials", 400);
    }
    return user;
    }

    export async function deleteUsers(id: number): Promise<User | undefined> {
      return await db.deleteUser(id);
    }

    export async function updateUsers(id: number, user: User) {
      const dataUser = {
        id,
        fieldsToUpdate: user,
      };
      const updateProfile: User = await db.editUser(dataUser);
      return updateProfile;
    }
    