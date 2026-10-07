import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glow = false }) => {
  return (
    <div
      className={`bg-zinc-900/80 border border-zinc-800/90 rounded-xl p-5 shadow-sm backdrop-blur-md relative overflow-hidden transition-all ${
        glow ? 'ring-1 ring-indigo-500/30 shadow-indigo-500/10 shadow-lg' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({
  title,
  subtitle,
  action,
}) => (
  <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
    <div>
      <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
      {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default Card;
