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
