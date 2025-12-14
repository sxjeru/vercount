import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    // 核心计数功能必需
    KV_REST_API_URL: z.url(),
    KV_REST_API_TOKEN: z.string().min(1),

    // 用户管理功能可选（不需要用户系统时可以不填）
    DATABASE_URL: z.url().optional(),
    GITHUB_CLIENT_ID: z.string().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
    BETTER_AUTH_SECRET: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.url(),
  },

  // only for client env variables
  experimental__runtimeEnv: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  }
});