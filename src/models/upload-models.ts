import { z } from "zod";

export const clientSchema = z.object({
  name: z.string()
    .min(1, { message: "El campo 'name' no puede estar vacío" })
    .refine(value => isNaN(Number(value)), { message: "El campo 'name' no puede ser un número o cadena vacía" })
    .refine(value => value.length <= 20, { message: "El campo 'name' no puede tener más de 20 caracteres" }),

  email: z.string()
    .min(1, { message: "El campo 'email' no puede estar vacío." })
    .email({ message: "El formato del correo electrónico es inválido, falta @" }),
    age: z.number()
    .min(1, { message: "El campo 'age' debe ser un número mayor a 0"})
    .int()
    .positive({ message: "El campo 'age' debe ser un número positivo" })
    .transform(value => {
      const parsedValue = Number(value);
      if (isNaN(parsedValue)) {
        throw new Error("Solo se aceptan números en el campo 'age'.");
      }
      return parsedValue;
    }),
    role: z.enum(["admin", "user"], {
        errorMap: () => ({ message: "El rol debe ser admin o user"}),
      }).default("user"),
});

export type ClientParams = z.infer<typeof clientSchema>;

export type Client = ClientParams & { id: number };


