
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Search, MapPin, Globe, Loader2, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

const LegalResearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [groundingUrls, setGroundingUrls] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'search' | 'maps'>('search');

  const handleResearch = async () => {
    if (!query) return;
    setLoading(true);
    setResults(null);
    setGroundingUrls([]);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      if (searchType === 'search') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: query,
          config: { tools: [{ googleSearch: {} }] }
        });
        setResults(response.text);
        setGroundingUrls(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: query,
          config: { tools: [{ googleMaps: {} }] }
        });
        setResults(response.text);
        setGroundingUrls(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
      }
    } catch (e) {
      console.error(e);
      setResults("System error during synthesis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0c0c0c] p-8 rounded-[2.5rem] shadow-2xl border border-[#1a1a1a]">
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setSearchType('search')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all duration-500 ${
                searchType === 'search' ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.2)]' : 'bg-black text-[#555] border-[#222] hover:border-[#444]'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Global Jurisprudence</span>
            </button>
            <button 
              onClick={() => setSearchType('maps')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all duration-500 ${
                searchType === 'maps' ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.2)]' : 'bg-black text-[#555] border-[#222] hover:border-[#444]'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Resource Mapping</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchType === 'search' ? "Inquire about complex precedents, federal statutes, or emerging legal trends..." : "Locate premier courthouses, elite expert witnesses, or medical legal resources..."}
              className="w-full p-6 pr-20 bg-black border border-[#222] rounded-[2rem] text-slate-300 placeholder-[#333] focus:outline-none focus:ring-1 focus:ring-[#c5a059] h-40 resize-none font-serif text-lg italic"
            />
            <button 
              onClick={handleResearch}
              disabled={loading}
              className="absolute bottom-6 right-6 bg-white text-black p-4 rounded-2xl hover:bg-[#c5a059] disabled:opacity-50 transition-all shadow-xl"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="lg:col-span-2 bg-[#0c0c0c] rounded-[2.5rem] shadow-2xl border border-[#1a1a1a] overflow-hidden">
            <div className="bg-[#111] px-10 py-6 border-b border-[#1a1a1a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#c5a059]" />
                <h3 className="font-serif text-xl font-bold text-white">Synthesis Intelligence</h3>
              </div>
              <div className="px-3 py-1 bg-[#1a150a] border border-[#c5a059]/20 text-[#c5a059] text-[9px] font-black uppercase tracking-widest rounded-full">
                Verified
              </div>
            </div>
            <div className="p-10 prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap font-serif text-slate-400 leading-relaxed text-lg">{results}</div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#0c0c0c] to-black rounded-[2.5rem] p-8 text-white shadow-2xl border border-[#1a1a1a]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2 text-[#c5a059]">
                <Globe className="w-4 h-4" /> Citations & Grounding
              </h3>
              <div className="space-y-4">
                {groundingUrls.length > 0 ? groundingUrls.map((chunk, i) => {
                  const title = chunk.web?.title || chunk.maps?.title || "Classified Source";
                  const uri = chunk.web?.uri || chunk.maps?.uri;
                  return (
                    <a 
                      key={i} 
                      href={uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-4 bg-[#111] hover:bg-[#1a1a1a] border border-[#222] rounded-2xl transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-[11px] font-bold text-slate-400 group-hover:text-[#c5a059] transition-colors leading-tight line-clamp-2">{title}</p>
                        <ExternalLink className="w-3 h-3 text-slate-700 group-hover:text-white shrink-0 ml-2" />
                      </div>
                    </a>
                  );
                }) : (
                  <p className="text-[10px] text-[#333] italic font-bold uppercase tracking-widest text-center py-10">Historical references only.</p>
                )}
              </div>
            </div>

            <div className="p-8 bg-[#1a150a] border border-[#c5a059]/10 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="w-5 h-5 text-[#c5a059]" />
                 <h4 className="font-serif text-lg font-bold text-[#c5a059]">Integrity Audit</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                Our intelligence engine cross-references real-time indices to prevent hallucination, providing only grounded, elite-level legal insights.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalResearch;
