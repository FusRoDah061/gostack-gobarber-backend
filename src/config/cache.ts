import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';

  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: 'redis',

  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASS || undefined,
      path: process.env.HEROKU_REDIS_WHITE_URL ?? process.env.HEROKU_REDIS_WHITE_TLS_URL
    },
  },
} as ICacheConfig;
