export const DB_CONFIG = {
  type: 'postgres' as const,
  host: process.env.POSTGRES_HOST || 'postgres' ,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [`${__dirname}/entities/*.entity{.ts,.js}`],
  synchronize: true,
};

export const DEBUG_REDIS = process.env.DEBUG_REDIS === 'true' || false;
export const REDIS_CONFIG = {
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
};

export const JACKETT_CONFIG = {
  timeoutAutomatic: Number(process.env.JACKETT_AUTOMATIC_SEARCH_TIMEOUT),
  timeoutManual: Number(process.env.JACKETT_MANUAL_SEARCH_TIMEOUT),
  host: process.env.JACKETT_HOST || 'jackett',
  port: process.env.JACKETT_PORT || '9117',

}

export const TRANSMISSION_CONFIG = {
  host: process.env.TRANSMISSION_HOST || 'transmission',
  port: process.env.TRANSMISSION_PORT || '9091'
}

export const LIBRARY_CONFIG = {
  moviesFolderName: process.env.LIBRARY_MOVIES_FOLDER_NAME,
  tvShowsFolderName: process.env.LIBRARY_TV_SHOWS_FOLDER_NAME,
};
