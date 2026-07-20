import 'server-only';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

export type ContactRatelimitResult = Awaited<ReturnType<Ratelimit['limit']>>;

let _redis: Redis | null = null;
let _contactRatelimit: Ratelimit | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        'Missing Upstash credentials: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set.'
      );
    }

    _redis = new Redis({ url, token });
  }

  return _redis;
}

export function getContactRatelimit(): Ratelimit {
  if (!_contactRatelimit) {
    _contactRatelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(10, '1 h'),
      analytics: true,
      prefix: 'ratelimit:contact',
    });
  }

  return _contactRatelimit;
}
