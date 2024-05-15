import { z } from "zod";

export const clientSchema = z.object({
  name: z.string()
    .min(1, { message: "El campo 'name' no puede estar vacío" })
    .refine(value => isNaN(Number(value)), { message: "El campo 'name' no puede ser un número o cadena vacía" })
    .refine(value => value.length <= 20, { message: "El campo 'name' no puede tener más de 20 caracteres" }),

  email: z.string()
    .min(1, { message: "El campo 'email' no puede estar vacío." })
    .email({ message: "El formato del correo electrónico es inválido, falta @" }),
