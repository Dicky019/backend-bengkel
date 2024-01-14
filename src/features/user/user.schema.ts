import { Role } from "@prisma/client";
import { z } from "zod";
import { idSchema } from "~/schemas";

/**
 * Defines the schema for the user object.
 *
 * The user object contains:
 * - name: The user's name as a string with min length 3
 * - email: The user's email as a valid email string
 * - password: The user's password as a string with min length 8
 * - nomorTelephone: The user's phone number as a valid phone number string example : "+62 813-444-5555"
 * - role: The user's role as a Role enum : pengendara, motir, admin
 */
export const createUserSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").min(0, "Nama harus diisi"),
  email: z.string().min(1, "Email harus diisi").email("Email tidak valid"),
  nomorTelephone: z
    .string()
    .min(1, "No.telephone harus diisi")
    .regex(/^\+(\d{2})\s(\d{3})-(\d{3})-(\d{4})$/, "No.telephone tidak valid"),
  role: z.enum(["pengendara", "motir"]),
});

/**
 * Merges the idSchema and optional fields from createUserSchema
 * to define the schema for updating a user. This allows updating
 * the fields from createUserSchema while requiring the id field.
 */
export const updateUserSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").optional(),
  email: z.string().email("Email tidak valid").optional(),
  password: z.string().min(8, "Password minimal 8 karakter").optional(),
  nomorTelephone: z
    .string()
    .regex(/^\+(\d{2})\s(\d{3})-(\d{3})-(\d{4})$/, "No.telephone tidak valid")
    .optional(),
  role: z.enum(["pengendara", "motir"]).optional(),
});
