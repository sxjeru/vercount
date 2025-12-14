import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),

    BETTER_AUTH_SECRET: z.string().min(1),

    DATABASE_URL: z.url(),

    KV_REST_API_URL: z.url(),
    KV_REST_API_TOKEN: z.string(),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.url(),
  },

  // only for client env variables
  experimental__runtimeEnv: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  }
});