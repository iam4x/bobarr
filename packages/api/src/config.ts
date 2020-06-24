export const DB_CONFIG = {
  type: 'postgres' as const,
  host: 'postgres',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [`${__dirname}/entities/*.entity{.ts,.js}`],
  synchronize: true,
};

export const DEBUG_REDIS = process.env.DEBUG_REDIS === 'true' || false;
export const REDIS_CONFIG = {
  host: 'redis',
  port: 6379,
  password: process.env.REDIS_PASSWORD,
};

export const JACKETT_RESPONSE_TIMEOUT = {
  automatic: Number(process.env.JACKETT_AUTOMATIC_SEARCH_TIMEOUT),
  manual: Number(process.env.JACKETT_MANUAL_SEARCH_TIMEOUT),
};

export const LIBRARY_CONFIG = {
  moviesFolderName: process.env.LIBRARY_MOVIES_FOLDER_NAME,
  tvShowsFolderName: process.env.LIBRARY_TV_SHOWS_FOLDER_NAME,
};
