import mysql, { type Pool } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

declare global {
  var editorialPool: Pool | undefined;
}

const databaseUrl = process.env.DATABASE_URL ?? "mysql://editorial:editorial@127.0.0.1:3306/editorial";

export const pool = globalThis.editorialPool ?? mysql.createPool({
  uri: databaseUrl,
  connectionLimit: 4,
  maxIdle: 4,
  idleTimeout: 60_000,
  enableKeepAlive: true,
  timezone: "Z",
});

if (process.env.NODE_ENV !== "production") globalThis.editorialPool = pool;

export const db = drizzle({ client: pool, schema, mode: "default" });
