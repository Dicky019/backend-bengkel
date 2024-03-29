import { z } from "zod";

/**
 * Defines the schema for the login object.
 *
 * The login object contains:
 * - email: The user's email as a valid email string
 * - password: The user's password as a string with min length 8
 */
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

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
export const signInSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").min(3, "Nama minimal 3 karakter"),
  email: z.string().min(1, "Email harus diisi").email("Email tidak valid"),
  password: z
    .string()
    .min(1, "Password harus diisi")
    .min(8, "Password minimal 8 karakter"),
  nomorTelephone: z
    .string()
    .min(1, "No.telephone harus diisi")
    .regex(/^\+(\d{2})\s(\d{3})-(\d{3})-(\d{4})$/, "No.telephone tidak valid"),
  role: z.enum(["pengendara", "motir"]),
});

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
export const googleCallbackSchema = z.object({
  code: z.string().min(1, "Nama harus diisi").min(3, "Nama minimal 3 karakter"),
  role: z.enum(["pengendara", "motir"]).default("pengendara"),
});
