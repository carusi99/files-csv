import { User } from "../models/auth-models";
import * as db from "../db";

//OBTIENE EL USUARIO POR SU NOMBRE
export async function getUserByName(
    name: string
  ): Promise<User | undefined> {
    return (
      await db.query("SELECT * FROM users WHERE name=$1", [name])
    ).rows[0];
  }