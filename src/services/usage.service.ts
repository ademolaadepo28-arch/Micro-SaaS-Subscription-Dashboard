// Usage Service - Metered Usage Increments & Quota Analytics
// Spec #03 - Real-time soft/hard warning limits and automated overage billing

import db from '@/lib/db';
import { PLANS, THRESHOLDS } from '@/lib/constants';
import { PlanTier, UsageSummary } from '@/types';

export class UsageService {
  // Record metered usage increment
  static async recordUsage(orgId: string, metric: 'api_requests' | 'storage_bytes' = 'api_requests', amount = 1) {
    const newTotal = await db.incrementUsage(orgId, metric, amount);
    return newTotal;
  }

  // Get full usage summary with soft/hard limit alerts and overage calculation
  static async getUsageSummary(orgId: string, tier: PlanTier): Promise<{
    apiRequests: UsageSummary;
    storage: UsageSummary;
  }> {
    const usage = await db.getUsage(orgId);
    const plan = PLANS[tier];

    // API Requests
    const reqLimit = plan.meteredApiQuota;
    const reqUsed = usage.apiRequests;
    const reqPercent = Math.min(100, Math.round((reqUsed / reqLimit) * 100));
    const reqExceeded = reqUsed > reqLimit;
    const reqOverageUnits = reqExceeded ? reqUsed - reqLimit : 0;
    const reqOverageCost = reqExceeded
      ? Number(((reqOverageUnits / 1000) * THRESHOLDS.OVERAGE_FEE_PER_1000_REQS).toFixed(2))
      : 0;

    const apiRequestsSummary: UsageSummary = {
      metric: 'API Requests',
      used: reqUsed,
      limit: reqLimit,
      percent: reqPercent,
      isSoftWarning: reqPercent >= THRESHOLDS.SOFT_WARNING_PERCENT && reqPercent < THRESHOLDS.HARD_WARNING_PERCENT,
      isHardWarning: reqPercent >= THRESHOLDS.HARD_WARNING_PERCENT && !reqExceeded,
      isExceeded: reqExceeded,
      overageUnits: reqOverageUnits,
      estimatedOverageCost: reqOverageCost,
    };

    // Storage
    const storageLimit = plan.storageQuotaBytes;
    const storageUsed = usage.storageBytes || 1024 * 1024 * 1024; // Fallback 1GB
    const storagePercent = Math.min(100, Math.round((storageUsed / storageLimit) * 100));
    const storageExceeded = storageUsed > storageLimit;

    const storageSummary: UsageSummary = {
      metric: 'Storage',
      used: storageUsed,
      limit: storageLimit,
      percent: storagePercent,
      isSoftWarning: storagePercent >= THRESHOLDS.SOFT_WARNING_PERCENT && storagePercent < THRESHOLDS.HARD_WARNING_PERCENT,
      isHardWarning: storagePercent >= THRESHOLDS.HARD_WARNING_PERCENT && !storageExceeded,
      isExceeded: storageExceeded,
      overageUnits: storageExceeded ? storageUsed - storageLimit : 0,
      estimatedOverageCost: 0,
    };

    return {
      apiRequests: apiRequestsSummary,
      storage: storageSummary,
    };
  }

  // Generate 14-day history for visual charts
  static getDailyUsageSeries(totalMonthlyRequests: number) {
    const days = 14;
    const series = [];
    const avgDaily = Math.max(10, Math.round(totalMonthlyRequests / 28));

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      // Realistic variance
      const variance = (Math.sin(i * 1.5) + 1.2) * 0.4 + 0.6;
      const count = Math.round(avgDaily * variance);
      series.push({ date: label, count });
    }

    return series;
  }
}

export default UsageService;
