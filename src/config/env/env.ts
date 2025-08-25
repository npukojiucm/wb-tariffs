import dotenv from 'dotenv';
import { z } from 'zod';
import { rootPath } from '#utils/utils.js';

dotenv.config({ path: rootPath('.env') });

const intFromString = z
  .string()
  .regex(/^\d+$/)
  .transform((v) => parseInt(v, 10));

// если мы в докере — используем сервис postgres и порт 5432
const isDocker = process.env.DOCKER_ENV === 'true';

const envDBSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).optional(),

  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: intFromString,
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),

  APP_PORT: intFromString.optional(),
});

const envAPISchema = z.object({
  WB_API_KEY: z.string().min(1, 'WB_API_KEY is required'),
  WB_TARIFFS_URL: z
    .preprocess(
      (v) =>
        v === undefined || (typeof v === 'string' && v.trim() === '')
          ? undefined
          : v,
      z.url({ normalize: false, message: 'Invalid WB_TARIFFS_URL' }),
    )
    .default('https://common-api.wildberries.ru/api/v1/tariffs/box'),
  GOOGLE_SHEETS_IDS: z
    .string()
    .default('')
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  GOOGLE_CREDENTIALS_JSON_BASE64: z
    .string()
    .min(1, 'Google creds (base64) required'),
});

const envDB = envDBSchema.parse({
  NODE_ENV: process.env.NODE_ENV,

  POSTGRES_HOST: isDocker ? 'postgres' : process.env.POSTGRES_HOST,
  POSTGRES_PORT: isDocker ? '5432' : process.env.POSTGRES_PORT,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,

  APP_PORT: process.env.APP_PORT,
});

const envAPI = envAPISchema.parse({
  WB_API_KEY: process.env.WB_API_KEY,
  WB_TARIFFS_URL: process.env.WB_TARIFFS_URL,

  GOOGLE_SHEETS_IDS: process.env.GOOGLE_SHEETS_IDS,
  GOOGLE_CREDENTIALS_JSON_BASE64:
  process.env.GOOGLE_CREDENTIALS_JSON_BASE64,
});

export { envDB, envAPI };
