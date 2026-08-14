import { betterAuth } from "better-auth";
import { pool } from "@/db";
import { siteName } from "@/lib/site";

export const auth = betterAuth({
  appName: siteName,
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? "editorial-development-secret-change-before-deploying",
  trustedOrigins: (process.env.TRUSTED_ORIGINS ?? "http://localhost:3000,http://127.0.0.1:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "reader", input: false },
      username: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  rateLimit: { enabled: true, window: 60, max: 100 },
});
