import { z } from "zod";

export const userSchema = z.object({
  name: z.string({
    invalid_type_error: "Name must be a string",
  }).optional(),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, "Password must be at least 6 characters long"),

  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  }).email({ message: "The email format is invalid" }),

  role: z.enum(["admin", "user"], {
    errorMap: () => ({ message: "Role must be admin or user" }),
  }).default("user"),

  age: z
    .number({
      required_error: "Age is required and must be a number",
      invalid_type_error: "Age must be a number",
    })
    .optional(),
});

export type UserParams = z.infer<typeof userSchema>;

export type User = UserParams & { id: number, [key: string]: any; };

export interface UpdateUser {
  id: number;
  fieldsToUpdate: Partial<User>;
}
