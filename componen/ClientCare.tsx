
import React, { useState } from 'react';
import { 
  MessageSquare, Mail, Phone, 
  Search, Filter, ExternalLink,
  ChevronRight, Smile, User, Send, Star
} from 'lucide-react';

const mockInteractions = [
  { id: '1', client: 'Samantha Reed', type: 'Email', status: 'Secured', summary: 'Query about court date for Reed vs. City', response: 'Confirmed date (Oct 12) and shared preparation checklist.', time: '10 mins ago', value: 'High' },
  { id: '2', client: 'Marc Thompson', type: 'Text', status: 'Secured', summary: 'Asking for settlement update', response: 'Updated on current mediation status. Reassured client of progress.', time: '45 mins ago', value: 'Mid' },
  { id: '3', client: 'Global Logistics Inc.', type: 'Call', status: 'Urgent', summary: 'Escalation regarding contract breach', response: 'Gathered details, scheduled urgent meeting for Monday 9AM.', time: '1 hour ago', value: 'Prime' },
  { id: '4', client: 'James Wilson', type: 'Email', status: 'Secured', summary: 'General inquiry about probate services', response: 'Provided service overview and fee schedule.', time: '3 hours ago', value: 'Low' },
];

const ClientCare: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
      {/* Interaction List */}
      <div className="lg:col-span-3 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0c0c0c] p-6 rounded-3xl border border-[#1a1a1a]">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input 
              type="text" 
              placeholder="Search elite client communications..." 
              className="w-full pl-12 pr-4 py-3 bg-black border border-[#222] rounded-2xl text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 border border-[#222] rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:bg-[#111] hover:text-white transition-all">
              <Filter className="w-4 h-4" /> Refine
            </button>
            <button className="px-6 py-3 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#c5a059] transition-all">
              Ledger Export
            </button>
          </div>
        </div>

        <div className="bg-[#0c0c0c] rounded-[2rem] border border-[#1a1a1a] shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#111] text-[#444] text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Correspondent</th>
                <th className="px-8 py-5">Channel</th>
                <th className="px-8 py-5">Brief</th>
                <th className="px-8 py-5">Protocol</th>
                <th className="px-8 py-5">Value</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {mockInteractions.map((item) => (
                <tr 
                  key={item.id} 
                  className={`group cursor-pointer transition-all duration-300 ${selectedId === item.id ? 'bg-[#1a150a]/30' : 'hover:bg-[#111]'}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#222] to-black border border-[#333] flex items-center justify-center text-xs font-black text-[#c5a059]">
                        {item.client.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="font-serif font-bold text-white block">{item.client}</span>
                        <span className="text-[9px] text-slate-600 uppercase font-bold tracking-tighter">{item.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-[#c5a059] transition-colors">
                      {item.type === 'Email' && <Mail className="w-4 h-4" />}
                      {item.type === 'Text' && <MessageSquare className="w-4 h-4" />}
                      {item.type === 'Call' && <Phone className="w-4 h-4" />}
                      <span className="text-xs font-bold uppercase tracking-widest">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-400 font-medium max-w-xs truncate">{item.summary}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      item.status === 'Secured' ? 'bg-[#0a1a10] text-green-500 border-green-900/30' : 'bg-[#1a0a0a] text-red-500 border-red-900/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1">
                      {[...Array(item.value === 'Prime' ? 3 : item.value === 'High' ? 2 : 1)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-[#c5a059] fill-[#c5a059]" />
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <ChevronRight className={`w-4 h-4 text-[#222] group-hover:text-[#c5a059] transition-all ${selectedId === item.id ? 'translate-x-1 text-[#c5a059]' : ''}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail View */}
      <div className="space-y-8">
        <div className="bg-[#0c0c0c] rounded-[2rem] border border-[#1a1a1a] shadow-2xl p-8">
          <h3 className="font-serif text-xl font-bold text-white mb-6">Synergy Designer</h3>
          <div className="space-y-6">
            <p className="text-[11px] text-[#555] leading-relaxed italic border-l-2 border-[#c5a059] pl-4">
              "Responsiveness is the ultimate luxury. JurisPulse ensures your clients feel prioritized, always."
            </p>
            
            <div className="space-y-6 pt-2">
              <div className="p-5 bg-[#1a150a] rounded-2xl border border-[#c5a059]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[#c5a059]" />
                  <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Active Persona</span>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Sophisticated, concise, and strategically reassuring.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#444] uppercase tracking-[0.2em]">Escalation Threshold</label>
                <div className="flex items-center justify-between p-4 bg-black border border-[#222] rounded-2xl">
                  <span className="text-xs text-slate-300 font-bold">Unattended &gt; 120s</span>
                  <div className="w-10 h-5 bg-[#c5a059] rounded-full flex items-center justify-end px-1 cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#444] uppercase tracking-[0.2em]">Vocal Signature</label>
                <select className="w-full p-3 bg-black border border-[#222] rounded-2xl text-xs font-bold text-[#c5a059] focus:outline-none">
                  <option>Kore — Authority & Depth</option>
                  <option>Puck — Empathy & Grace</option>
                  <option>Zephyr — Global Neutral</option>
                </select>
              </div>
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-[#111] text-[#c5a059] border border-[#c5a059]/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#c5a059] hover:text-black transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> Full Dossier Access
            </button>
          </div>
        </div>

        {/* Quick Message Test */}
        <div className="bg-gradient-to-br from-[#111] to-black rounded-[2rem] shadow-2xl p-8 border border-[#1a1a1a] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
            <Send className="w-24 h-24 rotate-12" />
          </div>
          <h3 className="font-serif text-lg font-bold text-white mb-2 relative z-10">Simulation</h3>
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-6 relative z-10">Test automated refinement</p>
          <textarea 
            placeholder="Type a sample client inquiry..."
            className="w-full p-4 bg-black border border-[#222] rounded-2xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c5a059] mb-4 h-24 resize-none placeholder-[#333]"
          />
          <button className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#c5a059] transition-all">
            Simulate Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCare;
