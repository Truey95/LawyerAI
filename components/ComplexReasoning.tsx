
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { BrainCircuit, Loader2, Sparkles, Send, ShieldCheck, History, Diamond } from 'lucide-react';

const ComplexReasoning: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleReasoning = async () => {
    if (!input) return;
    setIsThinking(true);
    setResponse('');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: input,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are an elite legal strategist. Your task is to perform deep, multi-layered reasoning. Break down complex litigation strategies with unparalleled intellectual depth."
        }
      });
      setResponse(result.text || '');
    } catch (e) {
      console.error(e);
      setResponse("Deep reasoning interface disconnected.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-14rem)] gap-10">
      {/* Sidebar Controls */}
      <div className="w-80 flex flex-col gap-8">
        <div className="bg-[#0c0c0c] p-8 rounded-[2.5rem] shadow-2xl border border-[#1a1a1a]">
          <h3 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Ethics Protocol
          </h3>
          <ul className="space-y-4">
            {[
              "Privileged Encryption",
              "Conflict Verification",
              "Precedent Simulation",
              "Regulatory Guardrails"
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full shadow-[0_0_8px_#c5a059]"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 bg-[#0c0c0c] p-8 rounded-[2.5rem] shadow-2xl border border-[#1a1a1a] overflow-hidden flex flex-col">
          <h3 className="text-[10px] font-black text-[#444] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <History className="w-4 h-4" /> Strategy Archive
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4">
            <p className="text-[10px] text-[#222] font-black uppercase tracking-widest italic text-center py-20">Archive Secure</p>
          </div>
        </div>
      </div>

      {/* Main Reasoning Interface */}
      <div className="flex-1 flex flex-col bg-[#0c0c0c] rounded-[3rem] shadow-2xl border border-[#1a1a1a] overflow-hidden">
        {/* Output Area */}
        <div className="flex-1 overflow-y-auto p-12 scroll-smooth">
          {isThinking ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in duration-1000">
              <div className="relative">
                <BrainCircuit className="w-20 h-20 text-[#c5a059] animate-pulse" />
                <div className="absolute inset-0 border border-[#c5a059]/10 border-t-[#c5a059] rounded-full animate-spin -m-8"></div>
                <div className="absolute inset-0 border border-[#c5a059]/5 border-b-[#c5a059]/50 rounded-full animate-reverse-spin -m-12"></div>
              </div>
              <div>
                <h4 className="text-2xl font-serif font-bold text-white mb-2 tracking-tight italic">Synergy in Progress</h4>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed italic">
                  Utilizing maximum compute budget to simulate adversarial outcomes and litigation strategy.
                </p>
              </div>
            </div>
          ) : response ? (
            <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-3 text-[#c5a059] font-black mb-10 text-[10px] uppercase tracking-[0.4em]">
                <Diamond className="w-4 h-4" /> Strategy Crystallized
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-slate-400 font-serif text-xl italic">
                {response}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#1a1a1a] text-center space-y-6">
              <BrainCircuit className="w-24 h-24 opacity-20" />
              <div>
                <p className="text-2xl font-serif font-bold italic opacity-40">Strategic Engine Idle</p>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-3 opacity-20">Submit complex mandates</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-8 bg-black/50 border-t border-[#1a1a1a]">
          <div className="max-w-4xl mx-auto flex gap-6">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReasoning()}
                placeholder="Declare your strategic objective..."
                className="w-full py-5 px-8 bg-black border border-[#222] rounded-[2rem] shadow-xl text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#c5a059] font-serif italic text-lg placeholder-[#333]"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[9px] font-black text-[#c5a059] uppercase tracking-[0.2em] pointer-events-none opacity-40">
                <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-pulse"></div>
                Prime Logic
              </div>
            </div>
            <button 
              onClick={handleReasoning}
              disabled={isThinking || !input}
              className="px-10 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-3 hover:bg-[#c5a059] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.05)] disabled:opacity-20"
            >
              {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Think
            </button>
          </div>
          <p className="text-center text-[9px] text-[#333] mt-6 font-black uppercase tracking-[0.4em]">
            Elite Decision Support System — Confidential
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplexReasoning;
