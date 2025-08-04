import Redis from 'ioredis';
import logger from '../utils/logger';

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '', // If you have a password
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis server');
});

redisClient.on('error', (err) => {
    logger.error('Redis connection error:', err);
});

export default redisClient;