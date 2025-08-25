import type { Knex } from 'knex';
import { envDB as env } from '#config/env/env.js';
import { rootPath } from '#utils/utils.js';

const NODE_ENV = env.NODE_ENV ?? 'development';

const config: Record<'development' | 'production', Knex.Config> = {
  development: {
    client: 'pg',
    connection: {
      host: env.POSTGRES_HOST ?? 'localhost',
      port: env.POSTGRES_PORT ?? 5432,
      user: env.POSTGRES_USER ?? 'postgres',
      password: env.POSTGRES_PASSWORD ?? 'postgres',
      database: env.POSTGRES_DB ?? 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: rootPath('src/postgres/migrations'),
      tableName: 'migrations',
      extension: 'ts',
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: env.POSTGRES_HOST ?? 'localhost',
      port: env.POSTGRES_PORT ?? 5432,
      user: env.POSTGRES_USER ?? 'postgres',
      password: env.POSTGRES_PASSWORD ?? 'postgres',
      database: env.POSTGRES_DB ?? 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: rootPath('dist/postgres/migrations'),
      tableName: 'migrations',
      extension: 'ts',
    },
  },
};

export default config[NODE_ENV];
