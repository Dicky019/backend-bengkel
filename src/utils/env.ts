import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
  server: {
    // PORT SERVER
    PORT: z.string().min(3),
    APP_URL: z.string().min(3),
    // DB
    DATABASE_URL: z.string().url(),
    REDIS_TOKEN: z.string().min(1),
    REDIS_URL: z.string().url(),
    // KINDE AUTH
    AUTH_SECRET: z.string().min(16),
    // TOKEN_ADMIN: z.string().min(16),
    // TOKEN_MOTIR: z.string().min(16),
    // TOKEN_PENGENDARA: z.string().min(16),
  },
  clientPrefix: "PUBLIC_",
  client: {
    // PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export default env;
