import { z } from "zod";

export const userSchema = z.object({

  name: z.string({
        invalid_type_error: "El Nombre debe ser un string",
      }).optional(),  

  password: z
    .string({
      required_error: "Password es requerido",
      invalid_type_error: "Password debe ser un string",
    })
    .min(6, "Password debe tener al menos 6 caracteres"),

  email: z.string({
    required_error: "Email es requerido",
    invalid_type_error: "Email debe ser un string",
  }).email({ message: "El formato del correo electrónico es inválido" }),

  role: z.enum(["admin", "user"], {
    errorMap: () => ({ message: "El rol debe ser admin o user" }),
  }).default("user"),

  age: z
    .number({
      required_error: "la Edad debe ser un número mayor a 0",
      invalid_type_error: "Edad debe ser un numero",
    })
    .optional(),
});

export type UserParams = z.infer<typeof userSchema>;

export type User = UserParams & { id: number };



