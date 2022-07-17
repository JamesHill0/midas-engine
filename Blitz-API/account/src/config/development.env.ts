import { PostgresDbConfig } from './database';
import RedisConfig from './redis';

export const environment = {
    service: {
        port: 8002,
        mode: 'DEVELOPMENT'
    },

    database: PostgresDbConfig,
    redis: RedisConfig,
    secret: process.env.SECRET != null ? process.env.SECRET : 'mR2DAEGZOi07dgShfpTp'
};