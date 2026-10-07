'use client';

import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import Badge from '../ui/Badge';

interface UsageProgressBarProps {
  label: string;
  current: number;
  max: number;
  unit?: string;
  isBytes?: boolean;
  allowOverage?: boolean;
}

export const UsageProgressBar: React.FC<UsageProgressBarProps> = ({
  label,
  current,
  max,
  unit = 'requests',
  isBytes = false,
  allowOverage = true,
}) => {
  const percent = max > 0 ? Math.round((current / max) * 100) : 0;
  const isSoftWarning = percent >= 80 && percent < 95;
  const isHardWarning = percent >= 95 && percent <= 100;
  const isExceeded = current > max;

  // Format bytes or numbers
  const formatValue = (val: number) => {
    if (isBytes) {
      if (val >= 1024 * 1024 * 1024) return `${(val / (1024 * 1024 * 1024)).toFixed(1)} GB`;
      return `${Math.round(val / (1024 * 1024))} MB`;
    }
    return val.toLocaleString();
  };

  // Bar color logic
  let barGradient = 'from-indigo-500 to-cyan-400';
  if (isExceeded) barGradient = 'from-rose-600 to-rose-500';
  else if (isHardWarning) barGradient = 'from-amber-500 to-rose-500';
  else if (isSoftWarning) barGradient = 'from-amber-400 to-amber-500';

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">{label}</span>
          {isExceeded ? (
            <Badge variant="danger" size="sm">
              <AlertOctagon className="w-3 h-3 mr-1" />
              Quota Exceeded ({percent}%)
            </Badge>
          ) : isHardWarning ? (
            <Badge variant="danger" size="sm">
              <AlertOctagon className="w-3 h-3 mr-1" />
              Hard Limit Warning ({percent}%)
            </Badge>
          ) : isSoftWarning ? (
            <Badge variant="warning" size="sm">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Soft Limit ({percent}%)
            </Badge>
          ) : (
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Normal ({percent}%)
            </Badge>
          )}
        </div>
        <div className="text-xs font-semibold text-zinc-300">
          <span>{formatValue(current)}</span>
          <span className="text-zinc-500 font-normal"> / {formatValue(max)} {unit}</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="relative h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${barGradient} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>

      {/* Warning & Overage message */}
      {isExceeded && allowOverage && (
        <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5">
          <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0" />
          Consumption exceeded plan quota. Additional requests are billed at $0.15 / 1,000 units.
        </p>
      )}
      {isSoftWarning && (
        <p className="text-xs text-amber-400/90 flex items-center gap-1.5 pt-0.5">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          Approaching monthly quota limit (80% reached). Consider upgrading your plan tier.
        </p>
      )}
    </div>
  );
};

export default UsageProgressBar;
