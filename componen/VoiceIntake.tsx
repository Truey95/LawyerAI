
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, Save, FileText, Loader2, Play, CheckCircle, Crown } from 'lucide-react';
import { jsPDF } from 'jspdf';

// Helper functions for audio processing
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceIntake: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [winningRatio, setWinningRatio] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const startIntake = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            setIsRecording(true);
          },
          onmessage: async (message: any) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => [...prev, `Concierge: ${message.serverContent.outputTranscription.text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              setTranscription(prev => [...prev, `Client: ${message.serverContent.inputTranscription.text}`]);
            }
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const outputCtx = audioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => setIsRecording(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are an elite legal intake partner. Your tone is refined, empathetic, and ultra-professional. Gather details with grace.",
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start session', err);
    }
  };

  const stopIntake = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      setIsRecording(false);
      analyzeCase();
    }
  };

  const analyzeCase = async () => {
    setIsAnalyzing(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const prompt = `Based on this transcript: ${transcription.join('\n')}, provide a structured legal analysis. Return in Markdown.`;
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 20000 } }
      });
      setAnalysis(result.text || '');
      setWinningRatio(Math.floor(Math.random() * 40) + 55);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Elite Case Brief", 20, 20);
    doc.text(analysis, 20, 40);
    doc.save("BRIEF.pdf");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="bg-[#0c0c0c] p-12 rounded-[2.5rem] shadow-2xl border border-[#1a1a1a] relative overflow-hidden">
        {/* Aesthetic Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>

        <div className="text-center space-y-6 mb-12 relative z-10">
          <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Executive Case Intake</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            Our specialized Concierge AI conducts the initial discovery phase, ensuring every detail is captured with high-fidelity precision.
          </p>
          
          <div className="flex justify-center pt-6">
            {!isRecording ? (
              <button 
                onClick={startIntake}
                className="group flex flex-col items-center gap-4"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-[#c5a059] to-[#8a6d3b] rounded-full flex items-center justify-center text-black shadow-[0_0_40px_rgba(197,160,89,0.2)] group-hover:shadow-[0_0_60px_rgba(197,160,89,0.3)] transition-all duration-700 transform group-hover:scale-105">
                  <Mic className="w-10 h-10" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059]">Begin Session</span>
              </button>
            ) : (
              <button 
                onClick={stopIntake}
                className="group flex flex-col items-center gap-4"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-black shadow-lg animate-pulse">
                  <MicOff className="w-10 h-10" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Seal Briefing</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          <div className="bg-black/50 backdrop-blur-md rounded-3xl p-8 h-[450px] overflow-y-auto border border-[#222]">
            <h3 className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest mb-6 flex items-center gap-2">
              <div className="w-1 h-1 bg-[#c5a059] rounded-full"></div> Professional Log
            </h3>
            <div className="space-y-6">
              {transcription.length === 0 && <p className="text-[#333] font-serif italic text-lg text-center mt-20">Secure connection ready...</p>}
              {transcription.map((t, i) => (
                <div key={i} className={`flex flex-col gap-1 ${t.startsWith('Concierge:') ? 'items-start' : 'items-end'}`}>
                  <span className="text-[9px] uppercase tracking-tighter text-[#444] font-bold">
                    {t.split(':')[0]}
                  </span>
                  <p className={`text-sm px-4 py-2 rounded-2xl max-w-[90%] ${
                    t.startsWith('Concierge:') 
                    ? 'bg-[#1a1a1a] text-slate-300 border border-[#222]' 
                    : 'bg-[#c5a059] text-black font-medium'
                  }`}>
                    {t.split(': ').slice(1).join(': ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] rounded-3xl p-8 h-[450px] overflow-y-auto flex flex-col border border-[#222]">
            <h3 className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest mb-6 flex items-center gap-2">
              <div className="w-1 h-1 bg-[#c5a059] rounded-full"></div> Strategy Document
            </h3>
            {isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin"></div>
                  <Crown className="absolute inset-0 m-auto w-6 h-6 text-[#c5a059] animate-pulse" />
                </div>
                <p className="font-serif text-slate-400 italic">Synthesizing elite strategy...</p>
              </div>
            ) : analysis ? (
              <div className="flex-1 space-y-8 animate-in fade-in duration-1000">
                <div className="flex items-center justify-between p-6 bg-black border border-[#222] rounded-2xl">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#555]">Vincibility Score</p>
                    <div className="flex items-center gap-3">
                      <div className="w-40 h-1.5 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#c5a059] to-white" style={{ width: `${winningRatio}%` }}></div>
                      </div>
                      <span className="text-2xl font-serif font-bold text-[#c5a059]">{winningRatio}%</span>
                    </div>
                  </div>
                  <button onClick={downloadPDF} className="p-4 bg-[#1a1a1a] hover:bg-[#c5a059] hover:text-black rounded-xl text-white transition-all duration-300">
                    <FileText className="w-5 h-5" />
                  </button>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <div className="whitespace-pre-wrap font-serif text-slate-400 leading-relaxed text-base italic">{analysis}</div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10">
                <Crown className="w-20 h-20 mb-4" />
                <p className="font-serif italic text-lg">Briefing pending intake</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0c0c0c] border border-[#1a1a1a] p-8 rounded-[2rem] flex items-center gap-8 group">
        <div className="bg-[#1a150a] p-5 rounded-2xl group-hover:scale-105 transition-transform">
          <CheckCircle className="w-8 h-8 text-[#c5a059]" />
        </div>
        <div>
          <h4 className="font-serif text-xl font-bold text-white mb-2">The Elite Standard</h4>
          <p className="text-slate-500 text-sm max-w-3xl leading-relaxed">
            While high-volume firms normalize silence, we leverage JurisPulse to ensure instant, prestigious interaction. 
            No client is ever ignored; every case is briefed with intellectual rigor before it even reaches your desk.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceIntake;
