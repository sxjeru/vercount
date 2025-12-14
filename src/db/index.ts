import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '@/env';
import * as schema from "@/db/schema"
import * as relations from "@/db/relations"

// 合并 schema 和 relations
const fullSchema = { ...schema, ...relations };

// 定义正确的数据库类型
type DbType = ReturnType<typeof drizzle<typeof fullSchema>>;

// 延迟初始化数据库连接，只在需要时创建
let _db: DbType | null = null;

export const getDb = (): DbType => {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for database operations. Please configure it in your environment variables.');
  }
  if (!_db) {
    _db = drizzle(env.DATABASE_URL, { schema: fullSchema });
  }
  return _db;
};

// 为了向后兼容，保留 db 导出（使用 Proxy 延迟访问）
export const db: DbType = new Proxy({} as DbType, {
  get(_, prop) {
    return Reflect.get(getDb(), prop);
  }
});