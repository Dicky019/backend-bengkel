import { Role } from "@prisma/client";
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
