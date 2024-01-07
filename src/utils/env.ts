import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    // PORT SERVER
    PORT: z.string().min(3),
    PORT_DOC: z.string().min(3),
    // DB
    DATABASE_URL: z.string().url(),
    REDIS_TOKEN: z.string().min(1),
    REDIS_URL: z.string().url(),
    // KINDE AUTH
    AUTH_SECRET : z.string().min(16),
    AUTH_URL : z.string().url(),
  },
  clientPrefix: "PUBLIC_",
  client: {
    // PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export type Env = typeof env;
