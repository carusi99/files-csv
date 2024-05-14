import { User } from "../models/auth-models";
import * as db from "../db";

//OBTIENE EL USUARIO POR EL EMAIL
export async function getUserByName(
    email: string
  ): Promise<User | undefined> {
    return (
      await db.query("SELECT * FROM users WHERE email=$1", [email])
    ).rows[0];
  }