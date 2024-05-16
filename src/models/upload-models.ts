import { z } from "zod";

export const clientSchema = z.object({
  name: z.string()
    .min(1, { message: "The 'name' field cannot be empty" })
    .refine(value => isNaN(Number(value)), { message: "The 'name' field cannot be a number or empty string" })
    .refine(value => value.length <= 20, { message: "The 'name' field cannot be more than 20 characters" }),

  email: z.string()
    .min(1, { message: "The 'email' field cannot be empty" })
    .email({ message: "Email format is invalid, missing @" }),
    age: z.number()
    .min(1, { message: "The 'age' field must be a number greater than 0"})
    .int()
    .positive({ message: "The 'age' field must be a positive number" })
    .transform(value => {
      const parsedValue = Number(value);
      if (isNaN(parsedValue)) {
        throw new Error("Expected number, received nan");
      }
      return parsedValue;
    }),
    role: z.enum(["admin", "user"], {
        errorMap: () => ({ message: "The role must be admin or user"}),
      }).default("user"),
});

export type ClientParams = z.infer<typeof clientSchema>;

export type Client = ClientParams & { id: number };


