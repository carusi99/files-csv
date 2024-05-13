import { User } from "../models/auth-models";
import * as db from "../db";

//OBTIENE EL USUARIO POR SU NOMBRE DE USERNAME
export async function getUserByUsername(
    username: string
  ): Promise<User | undefined> {
    return (
      await db.query("SELECT * FROM users WHERE username=$1", [username])
    ).rows[0];
  }