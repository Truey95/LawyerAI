
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Mic, 
  MessageSquareHeart, 
  Search, 
  Palette, 
  BrainCircuit, 
  Scale,
  LogOut,
  Bell,
  Settings
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import VoiceIntake from './components/VoiceIntake';
import ClientCare from './components/ClientCare';
import LegalResearch from './components/LegalResearch';
import CreativeStudio from './components/CreativeStudio';
import ComplexReasoning from './components/ComplexReasoning';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Dashboard);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.Dashboard: return <Dashboard />;
      case AppTab.VoiceIntake: return <VoiceIntake />;
      case AppTab.ClientCare: return <ClientCare />;
      case AppTab.LegalResearch: return <LegalResearch />;
      case AppTab.CreativeStudio: return <CreativeStudio />;
      case AppTab.ComplexReasoning: return <ComplexReasoning />;
      default: return <Dashboard />;
    }
  };

  const navItems = [
    { id: AppTab.Dashboard, label: 'Chancery Dashboard', icon: LayoutDashboard },
    { id: AppTab.VoiceIntake, label: 'Executive Intake', icon: Mic },
    { id: AppTab.ClientCare, label: 'Concierge AI', icon: MessageSquareHeart },
    { id: AppTab.LegalResearch, label: 'Prime Intelligence', icon: Search },
    { id: AppTab.CreativeStudio, label: 'Atelier Studio', icon: Palette },
    { id: AppTab.ComplexReasoning, label: 'Strategic Deep Think', icon: BrainCircuit },
  ];

  return (
    <div className="flex h-screen bg-black text-slate-200 overflow-hidden font-sansSelection">
      {/* Sidebar */}
      <aside className="w-72 bg-[#080808] border-r border-[#1a1a1a] flex flex-col z-20 shadow-2xl">
        <div className="p-8 flex items-center gap-4">
          <div className="bg-gradient-to-br from-[#c5a059] to-[#8a6d3b] p-2.5 rounded-lg shadow-[0_0_15px_rgba(197,160,89,0.3)]">
            <Scale className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-serif font-semibold tracking-tight bg-gradient-to-r from-[#f5f5f5] to-[#c5a059] bg-clip-text text-transparent">
            JurisPulse
          </h1>
        </div>
        
        <nav className="flex-1 px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group ${
                activeTab === item.id 
                ? 'bg-[#151515] text-[#c5a059] border border-[#c5a059]/20 shadow-[inset_0_0_10px_rgba(197,160,89,0.05)]' 
                : 'text-slate-500 hover:bg-[#111] hover:text-[#f5f5f5]'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-sm font-medium tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-4 px-4 py-3 bg-[#111] border border-[#222] rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#333] to-[#000] border border-[#444] flex items-center justify-center text-xs font-bold text-[#c5a059]">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">John Doe, Esq.</p>
              <p className="text-[10px] uppercase tracking-widest text-[#c5a059] font-semibold">Managing Partner</p>
            </div>
            <div className="flex flex-col gap-1">
              <Settings className="w-3.5 h-3.5 text-slate-600 hover:text-[#c5a059] cursor-pointer transition-colors" />
              <LogOut className="w-3.5 h-3.5 text-slate-600 hover:text-red-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#000]">
        <header className="h-20 border-b border-[#1a1a1a] flex items-center justify-between px-10 z-10 bg-black/50 backdrop-blur-xl">
          <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-bold mb-1">Executive Workspace</span>
             <h2 className="text-xl font-serif font-medium text-white">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group">
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#c5a059] rounded-full border border-black"></span>
            </div>
            <div className="h-8 w-[1px] bg-[#1a1a1a]"></div>
            <div className="px-4 py-1.5 bg-[#111] border border-[#c5a059]/20 text-[#c5a059] text-[10px] font-black rounded-full uppercase tracking-[0.15em] shadow-[0_0_15px_rgba(197,160,89,0.1)]">
              Synergy Engine Online
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
