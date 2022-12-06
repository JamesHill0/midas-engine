import RedisConfig from './redis';

export const environment = {
    service: {
        port: 8007,
        mode: 'DEVELOPMENT'
    },

    redis: RedisConfig,
    secret: process.env.SECRET != null ? process.env.SECRET : 'mR2DAEGZOi07dgShfpTp'
};