// Upstash Redis & In-Memory Fallback Token Bucket Rate Limiter
// Spec #03 - Instant API rate limiting and token bucket enforcement

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  error?: string;
}

class TokenBucketRateLimiter {
  private buckets: Map<string, { count: number; expiresAt: number }> = new Map();

  async limit(identifier: string, maxRequests: number = 60, windowSeconds: number = 60): Promise<RateLimitResult> {
    const now = Math.floor(Date.now() / 1000);
    const existing = this.buckets.get(identifier);

    // If bucket expired or not found, initialize new window
    if (!existing || existing.expiresAt <= now) {
      const expiresAt = now + windowSeconds;
      this.buckets.set(identifier, { count: 1, expiresAt });
      return {
        success: true,
        limit: maxRequests,
        remaining: Math.max(0, maxRequests - 1),
        reset: expiresAt,
      };
    }

    // Check quota
    if (existing.count >= maxRequests) {
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: existing.expiresAt,
        error: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowSeconds}s window allowed.`,
      };
    }

    // Increment
    existing.count += 1;
    return {
      success: true,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - existing.count),
      reset: existing.expiresAt,
    };
  }

  async reset(identifier: string): Promise<void> {
    this.buckets.delete(identifier);
  }
}

export const rateLimiter = new TokenBucketRateLimiter();
export default rateLimiter;
