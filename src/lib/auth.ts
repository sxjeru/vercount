import { betterAuth, BetterAuthOptions } from "better-auth";
import { env } from "@/env";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { createId } from "@paralleldrive/cuid2";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/db";

// 检查是否配置了用户管理所需的环境变量
const isAuthConfigured = () => {
  return !!(env.DATABASE_URL && env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.BETTER_AUTH_SECRET);
};

// 延迟初始化 auth 实例
let _auth: ReturnType<typeof betterAuth> | null = null;

const getAuth = () => {
  if (!isAuthConfigured()) {
    throw new Error('Auth is not configured. Please set DATABASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and BETTER_AUTH_SECRET environment variables.');
  }
  
  if (!_auth) {
    const options = {
      baseURL: env.NEXT_PUBLIC_API_BASE_URL,
      database: drizzleAdapter(getDb(), {
        provider: "pg",
        usePlural: true,
      }),
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        github: {
          clientId: env.GITHUB_CLIENT_ID!,
          clientSecret: env.GITHUB_CLIENT_SECRET!,
          overrideUserInfoOnSignIn: true,
        },
      },
      session: {
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60, // Cache duration in seconds
        },
      },
      plugins: [
        admin(), 
        nextCookies(), 
      ],
      advanced: {
        database: {
          generateId: () => {
            return createId();
          },
        },
      },
    } satisfies BetterAuthOptions;

    _auth = betterAuth({
      ...options,
      plugins: [
        ...(options.plugins ?? [])
      ],
    });
  }
  
  return _auth;
};

// 使用 Proxy 延迟访问 auth
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(_, prop) {
    return Reflect.get(getAuth(), prop);
  }
});

export type Session = typeof auth.$Infer.Session;

export const getServerSession = async () => {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });
  return session;
};
