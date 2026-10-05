import React, { useState } from 'react';
import { UserCheck, Tractor, Phone, ShieldAlert, CheckSquare, AlertCircle } from 'lucide-react';

export const ActionGuidance = ({ actions }) => {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' or 'farmer'

  if (!actions) return null;

  const citizenSteps = actions.citizen_steps || [];
  const farmerSteps = actions.farmer_steps || [];
  const emergencyContacts = actions.emergency_contacts || [];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Recommended Safety & Evacuation Protocols</h3>
        </div>
        <span className="text-xs font-mono uppercase px-3 py-1 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          {actions.urgency || 'MONITORING ADVISORY'}
        </span>
      </div>

      {/* Role Toggle Tabs */}
      <div className="flex border-b border-slate-800 mb-4">
        <button
          onClick={() => setActiveTab('citizen')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'citizen'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Citizen Action Checklist</span>
        </button>
        <button
          onClick={() => setActiveTab('farmer')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'farmer'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tractor className="w-4 h-4" />
          <span>Farmer & Rural Safeguards</span>
        </button>
      </div>

      {/* Checklist Content */}
      <div className="space-y-2.5 mb-6">
        {activeTab === 'citizen' ? (
          citizenSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200 leading-relaxed"
            >
              <CheckSquare className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{step}</span>
            </div>
          ))
        ) : (
          farmerSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200 leading-relaxed"
            >
              <Tractor className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{step}</span>
            </div>
          ))
        )}
      </div>

      {/* Emergency Contacts Footer */}
      {emergencyContacts.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-red-400" /> Immediate Dispatch Helplines
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {emergencyContacts.map((contact, idx) => (
              <a
                key={idx}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs transition group"
              >
                <span className="text-slate-300 truncate mr-2">{contact.label}:</span>
                <span className="font-mono text-cyan-400 font-bold group-hover:text-cyan-300">
                  {contact.number}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
