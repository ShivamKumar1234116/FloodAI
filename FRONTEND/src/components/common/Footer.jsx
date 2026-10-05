import React from 'react';
import { ShieldAlert, PhoneCall, Radio, ExternalLink, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#080d19] border-t border-slate-800 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">FloodShield AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decentralized localized flood risk intelligence platform. Combining machine learning,
              hydrological gauge telemetry, and verified relief networks.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Release v1.0.0 (Production)
            </div>
          </div>

          {/* Emergency Hotlines */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-red-400" /> Emergency Hotlines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between">
                <span className="text-slate-300">NDRF Headquarters:</span>
                <span className="font-mono text-red-400 font-bold">1078</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-300">State Disaster Control (SEOC):</span>
                <span className="font-mono text-amber-400 font-bold">1070</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-300">Ambulance Emergency:</span>
                <span className="font-mono text-emerald-400 font-bold">108</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-300">Haridwar Flood Control:</span>
                <span className="font-mono text-cyan-400 font-bold">01334-226601</span>
              </li>
            </ul>
          </div>

          {/* Monitored Basins */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400" /> Monitored Basins
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• Haridwar Upper Ganga Basin (Bhimgoda)</li>
              <li>• Patna Ganga & Son Confluence</li>
              <li>• Guwahati Brahmaputra Floodplain</li>
              <li>• Delhi Yamuna Lowlands</li>
              <li>• Mumbai Mithi River Delta</li>
            </ul>
          </div>

          {/* Model Transparency & Safety */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Safety & Model Disclaimer
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Risk predictions are derived from AI analysis of live meteorological and hydrological data.
              Estimates do not guarantee flood occurrences or supersede
              official directives from NDMA or district magistrates.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 FloodShield AI Disaster Response System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Open-Meteo & Central Water Commission Gauges</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
