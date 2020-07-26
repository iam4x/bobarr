export default () => ({
    database: {
        type: 'postgres' as const,
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        database: process.env.DATABASE_DB,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        entities: [`${__dirname}/entities/*.entity{.ts,.js}`],
        synchronize: true,
    },
    redis: {
        debug: process.env.DEBUG_REDIS === 'true',
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
    },
    jackett: {
        host: process.env.JACKETT_HOST,
        port: Number(process.env.JACKETT_PORT),
        manualSearchTimeout: Number(process.env.JACKETT_MANUAL_SEARCH_TIMEOUT),
        automaticSearchTimeout: Number(process.env.JACKETT_AUTOMATIC_SEARCH_TIMEOUT),
    },
    transmission: {
        host: process.env.TRANSMISSION_HOST,
        port: Number(process.env.TRANSMISSION_PORT),
        username: process.env.TRANSMISSION_USERNAME,
        password: process.env.TRANSMISSION_PASSWORD,
    },
    library: {
        moviesFolderName: process.env.LIBRARY_MOVIES_FOLDER_NAME,
        tvShowsFolderName: process.env.LIBRARY_TV_SHOWS_FOLDER_NAME,
    }
});