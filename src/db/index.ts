import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { env } from '@/env';
import * as schema from "@/db/schema"
import * as relations from "@/db/relations"

// 延迟初始化数据库连接，只在需要时创建
let _db: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for database operations. Please configure it in your environment variables.');
  }
  if (!_db) {
    _db = drizzle(env.DATABASE_URL, { schema: { ...schema, ...relations } });
  }
  return _db;
};

// 为了向后兼容，保留 db 导出（但会在访问时检查）
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return Reflect.get(getDb(), prop);
  }
});