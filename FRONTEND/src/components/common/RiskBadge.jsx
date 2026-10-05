import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export const RiskBadge = ({ level = 'LOW', probability, size = 'md' }) => {
  const normalizedLevel = (level || 'LOW').toUpperCase();

  const config = {
    LOW: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: ShieldCheck,
      dot: 'bg-emerald-400',
      label: 'Low Flood Risk',
    },
    MEDIUM: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      dot: 'bg-amber-400',
      label: 'Medium Risk Advisory',
    },
    HIGH: {
      bg: 'bg-orange-500/15 text-orange-400 border-orange-500/40 glow-high',
      icon: AlertTriangle,
      dot: 'bg-orange-400',
      label: 'High Flood Risk',
    },
    CRITICAL: {
      bg: 'bg-red-500/20 text-red-400 border-red-500/50 glow-critical',
      icon: ShieldAlert,
      dot: 'bg-red-400 animate-ping',
      label: 'CRITICAL INUNDATION BREACH',
    },
  }[normalizedLevel] || {
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    icon: ShieldCheck,
    dot: 'bg-slate-400',
    label: 'Unknown',
  };

  const Icon = config.icon;
  const sizeClasses = size === 'lg' ? 'px-4 py-2 text-base font-semibold' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border ${config.bg} ${sizeClasses}`}>
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <Icon className={size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
      {probability !== undefined && (
        <span className="opacity-80 font-mono text-[0.85em]">
          ({Math.round(probability * 100)}%)
        </span>
      )}
    </div>
  );
};
