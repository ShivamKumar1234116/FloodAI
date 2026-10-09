import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, ShieldAlert, LifeBuoy, Droplets, Tractor, HelpCircle } from 'lucide-react';
import { chatbotApi } from '../services/api';
import { useFlood } from '../context/FloodContext';

export const AssistantPage = () => {
  const { selectedLocation, assessmentData } = useFlood();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! I am the **FloodShield AI Disaster Assistant**.\n\nI can assist you with real-time evacuation guidelines, flood-risk diagnostics, clean water sterilization, farmer/livestock protocols, and emergency grab-bag checklists.\n\nCurrently monitoring: **${
        selectedLocation?.name || 'Haridwar'
      }** (Assessed Risk: **${assessmentData?.risk_assessment?.risk_level || 'LOW'}**). How can I protect you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await chatbotApi.sendQuery(
        userText,
        selectedLocation?.name,
        assessmentData?.risk_assessment?.risk_level,
        assessmentData?.features_used
      );
      setMessages((prev) => [...prev, { 
        sender: 'bot', 
        text: res.reply,
        source: res.source,
        disclaimer: res.disclaimer
      }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Temporary network error communicating with AI server. If this is an emergency, dial 1078 (NDRF) immediately.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q) => {
    setInput(q);
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>FloodShield Disaster AI Assistant</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h1>
            <p className="text-xs text-slate-400">
              Emergency guidance for flood safety, evacuation &amp; relief
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-slate-400 font-mono">Location Context:</span>
          <p className="text-xs font-bold text-cyan-400">{selectedLocation?.name?.split(',')[0]}</p>
        </div>
      </div>

      {/* Suggested Topics Bar */}
      <div className="py-3 flex items-center gap-2 overflow-x-auto text-xs flex-shrink-0 scrollbar-none">
        <span className="text-slate-500 font-semibold text-[11px] uppercase mr-1">Frequent:</span>
        <button
          onClick={() => handleQuickQuestion('What are the critical steps for immediate evacuation?')}
          className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition"
        >
          🚨 Evacuation Steps
        </button>
        <button
          onClick={() => handleQuickQuestion('How should farmers protect standing crops and cattle?')}
          className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition"
        >
          🌾 Farmer & Livestock
        </button>
        <button
          onClick={() => handleQuickQuestion('How do I sanitize and boil drinking water during flood?')}
          className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition"
        >
          💧 Drinking Water Safety
        </button>
        <button
          onClick={() => handleQuickQuestion('What items belong in an emergency 72-hour grab bag?')}
          className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition"
        >
          🎒 72h Grab-Bag Checklist
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 my-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-md ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-cyan-400 border border-slate-700'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-lg ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                  : 'glass-panel text-slate-200 border border-slate-800'
              }`}
            >
              <div dangerouslySetInnerHTML={{
                __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
              }} />
              {m.source && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 italic">
                    <span className="font-semibold text-cyan-400">Powered By: </span> {m.source}
                  </span>
                  {m.disclaimer && (
                    <span className="text-[10px] text-slate-500">
                      ⚠️ {m.disclaimer}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Bot className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Consulting flood response knowledge base...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="pt-2 flex-shrink-0 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask any question regarding flood dangers, shelters, first-aid, or farm safeguards..."
          className="flex-1 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-600/20 transition disabled:opacity-50 flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
