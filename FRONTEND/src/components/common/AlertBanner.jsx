import React, { useState } from 'react';
import { AlertCircle, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AlertBanner = ({ alerts = [] }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !alerts || alerts.length === 0) return null;

  const topAlert = alerts[0];

  return (
    <div className="bg-gradient-to-r from-red-950/80 via-amber-950/70 to-slate-900 border-b border-red-500/30 px-4 py-2.5 text-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded font-mono font-medium border border-red-500/30 uppercase flex-shrink-0">
            {topAlert.type || 'ACTIVE ALERT'}
          </span>
          <p className="text-sm font-medium truncate">
            <span className="text-white font-semibold">{topAlert.title}:</span>{' '}
            <span className="text-slate-300">{topAlert.message}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/alerts"
            className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold transition"
          >
            View All ({alerts.length}) <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
