
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Image as ImageIcon, Video, Wand2, Loader2, Download, Maximize2, Layers, Crown } from 'lucide-react';

const CreativeStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setOutputUrl(null);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      if (mode === 'image') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts: [{ text: prompt }] },
          config: {
            imageConfig: { aspectRatio: aspectRatio as any, imageSize: imageSize as any }
          }
        });
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) setOutputUrl(`data:image/png;base64,${part.inlineData.data}`);
        }
      } else {
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: prompt,
          config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: aspectRatio as any }
        });
        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setOutputUrl(URL.createObjectURL(blob));
      }
    } catch (e) {
      console.error(e);
      alert("Generation failure in atelier.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="space-y-8">
        <div className="bg-[#0c0c0c] p-8 rounded-[2.5rem] shadow-2xl border border-[#1a1a1a]">
          <h3 className="font-serif text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Crown className="w-6 h-6 text-[#c5a059]" /> Visual Atelier
          </h3>
          
          <div className="space-y-6">
            <div className="flex bg-black p-1.5 rounded-2xl border border-[#222]">
              <button 
                onClick={() => setMode('image')}
                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  mode === 'image' ? 'bg-[#c5a059] text-black shadow-lg' : 'text-[#444] hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Still Rendering
              </button>
              <button 
                onClick={() => setMode('video')}
                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  mode === 'video' ? 'bg-[#c5a059] text-black shadow-lg' : 'text-[#444] hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" /> Cinematic Veo
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-[#444] uppercase tracking-[0.3em]">Creative Mandate</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'image' ? "Bespoke mahogany law library, soft morning light, 8k resolution..." : "Sweeping cinematic drone shot of marble legal pillars, gold accents..."}
                className="w-full p-5 bg-black border border-[#222] rounded-2xl text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#c5a059] h-40 resize-none font-serif italic"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#444] uppercase tracking-[0.3em]">Canvas Ratio</label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full p-3 bg-black border border-[#222] rounded-xl text-[10px] font-bold text-[#c5a059] uppercase"
                >
                  <option value="16:9">Cinematic (16:9)</option>
                  <option value="9:16">Executive (9:16)</option>
                  <option value="1:1">Signature (1:1)</option>
                </select>
              </div>
              {mode === 'image' && (
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-[#444] uppercase tracking-[0.3em]">Fidelity</label>
                  <select 
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value)}
                    className="w-full p-3 bg-black border border-[#222] rounded-xl text-[10px] font-bold text-[#c5a059] uppercase"
                  >
                    <option value="1K">High Def</option>
                    <option value="2K">Quad Ultra</option>
                    <option value="4K">Prime 4K</option>
                  </select>
                </div>
              )}
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#c5a059] transition-all duration-500 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {isGenerating ? 'Synthesizing...' : `Manifest ${mode}`}
            </button>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-[#1a150a] to-black border border-[#c5a059]/10 rounded-[2.5rem]">
          <div className="flex items-center gap-3 text-[#c5a059] font-black uppercase tracking-widest text-[10px] mb-4">
            <Layers className="w-4 h-4" />
            <span>Brand Excellence</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed italic">
            Elite litigation deserves elite visualization. Create bespoke imagery for case presentations or high-end firm branding with our state-of-the-art visual engine.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-[#080808] rounded-[3rem] border border-[#1a1a1a] h-full min-h-[600px] flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
          {isGenerating ? (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="relative inline-block">
                <div className="w-32 h-32 border border-[#c5a059]/10 border-t-[#c5a059] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wand2 className="w-10 h-10 text-[#c5a059] animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-[#c5a059] font-black uppercase tracking-[0.4em] text-xs">Crystallizing Vision</p>
                <p className="text-[#333] text-[10px] mt-2">GPU-Accelerated Rendering in Progress</p>
              </div>
            </div>
          ) : outputUrl ? (
            <div className="w-full h-full relative group">
              {mode === 'image' ? (
                <img src={outputUrl} alt="Elite Asset" className="w-full h-full object-contain" />
              ) : (
                <video src={outputUrl} controls className="w-full h-full object-contain" />
              )}
              <div className="absolute bottom-8 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white hover:text-black transition-all">
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button className="p-4 bg-[#c5a059] text-black rounded-2xl shadow-xl hover:bg-white transition-all">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 bg-[#111] border border-[#222] rounded-full flex items-center justify-center mx-auto mb-8 opacity-20">
                <ImageIcon className="w-12 h-12 text-[#c5a059]" />
              </div>
              <p className="text-xl font-serif font-bold text-[#333] italic">Gallery Empty</p>
              <p className="text-[10px] font-black text-[#222] uppercase tracking-[0.4em] mt-3">Manifest your first asset</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeStudio;
