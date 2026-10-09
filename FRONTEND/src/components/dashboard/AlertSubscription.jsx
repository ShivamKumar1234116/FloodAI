import React, { useState } from 'react';
import { alertsApi } from '../../services/api';
import { useFlood } from '../../context/FloodContext';
import { Bell, MapPin, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const AlertSubscription = () => {
  const { selectedLocation } = useFlood();
  
  const [chatId, setChatId] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!chatId) return;
    if (!selectedLocation?.latitude) {
      setErrorMsg('Please select a location on the dashboard first.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await alertsApi.subscribe({
        phone_number: chatId,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude
      });
      setStatus('success');
    } catch (err) {
      console.error('Subscription error:', err);
      setErrorMsg('Failed to subscribe. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-white">Subscribe to Live Alerts</h3>
      </div>
      
      <p className="text-sm text-slate-400 mb-4">
        Get instant Telegram notifications with evacuation maps when the risk level in your area becomes CRITICAL.
      </p>

      {status === 'success' ? (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-emerald-300">Successfully Subscribed!</h4>
            <p className="text-xs text-emerald-400/80 mt-1">
              You will receive live flood alerts for {selectedLocation?.name || 'this location'} directly on Telegram.
            </p>
            <button 
              onClick={() => { setStatus('idle'); setChatId(''); }}
              className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 underline"
            >
              Subscribe another user
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Target Area</label>
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-slate-200">
                {selectedLocation?.name || 'Please select a location above'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Telegram Chat ID
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="e.g., 6972740931"
              className="w-full bg-slate-900/50 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1.5">
              Don't know your ID? Send a message to{' '}
              <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                @userinfobot
              </a>{' '}
              on Telegram.
            </p>
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/20 p-2 rounded">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !chatId || !selectedLocation}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg py-2.5 text-sm font-semibold shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Activate Alerts</span>
          </button>
        </form>
      )}
    </div>
  );
};
