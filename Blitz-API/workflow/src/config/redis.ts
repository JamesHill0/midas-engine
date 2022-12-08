export default {
    name: process.env.REDIS_NAME != null ? process.env.REDIS_NAME : 'blitz',
    url: process.env.REDIS_URL != null ? process.env.REDIS_URL : 'redis://:12345@192.168.56.1:6379'
}