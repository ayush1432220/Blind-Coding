import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisConnection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null
});

export const submissionQueue = new Queue('submission', { connection: redisConnection });