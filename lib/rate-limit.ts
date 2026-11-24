/**
 * Sliding Window In-Memory Rate Limiter
 * Provides IP-based rate limiting for sensitive operations
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 3600000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    });
  }, 300000);
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInSeconds: number;
  error?: string;
}

/**
 * Check if a key (e.g. IP + action) exceeds max allowed requests within a window
 * @param key Unique identifier (e.g., "login:192.168.1.1")
 * @param limit Max number of allowed hits
 * @param windowSeconds Window duration in seconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter out timestamps outside window
  record.timestamps = record.timestamps.filter((ts) => ts > cutoff);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetInSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
      error: `Terlalu banyak permintaan. Silakan tunggu ${Math.max(1, resetInSeconds)} detik sebelum mencoba lagi.`,
    };
  }

  record.timestamps.push(now);
  const remaining = limit - record.timestamps.length;
  return {
    success: true,
    remaining,
    resetInSeconds: windowSeconds,
  };
}

/**
 * Helper to extract client IP from Next.js headers
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

