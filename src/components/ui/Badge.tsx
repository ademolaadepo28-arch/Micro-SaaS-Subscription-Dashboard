import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'blue' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const base = 'inline-flex items-center font-medium rounded-full transition-all';
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantStyles = {
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700/60',
    success: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60',
    warning: 'bg-amber-950/80 text-amber-400 border border-amber-800/60',
    danger: 'bg-rose-950/80 text-rose-400 border border-rose-800/60',
    purple: 'bg-purple-950/80 text-purple-300 border border-purple-800/60',
    blue: 'bg-blue-950/80 text-blue-400 border border-blue-800/60',
    outline: 'bg-transparent text-zinc-400 border border-zinc-700',
  }[variant];

  return <span className={`${base} ${sizeStyles} ${variantStyles} ${className}`}>{children}</span>;
};

export default Badge;
