import { defineConfig } from 'drizzle-kit';

// drizzle-kit 只在运行 db:generate/db:migrate 时使用
// 此时必须配置 DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for database migrations');
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});