
import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { 
  Users, Briefcase, Clock, CheckCircle, TrendingUp, AlertCircle, Shield 
} from 'lucide-react';

const stats = [
  { label: 'Active Retainers', value: '124', change: '+12%', icon: Briefcase, color: 'text-[#c5a059]', bg: 'bg-[#1a150a]' },
  { label: 'AI Concierge Cycles', value: '1,243', change: '+24%', icon: Clock, color: 'text-[#c5a059]', bg: 'bg-[#1a150a]' },
  { label: 'Litigation Success', value: '94%', change: '+3%', icon: CheckCircle, color: 'text-[#c5a059]', bg: 'bg-[#1a150a]' },
  { label: 'Elite Prospecting', value: '18', change: '-5%', icon: Users, color: 'text-[#c5a059]', bg: 'bg-[#1a150a]' },
];

const data = [
  { name: 'Mon', intake: 12, handled: 10 },
  { name: 'Tue', intake: 19, handled: 18 },
  { name: 'Wed', intake: 15, handled: 15 },
  { name: 'Thu', intake: 22, handled: 20 },
  { name: 'Fri', intake: 30, handled: 28 },
  { name: 'Sat', intake: 10, handled: 10 },
  { name: 'Sun', intake: 8, handled: 8 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0c0c0c] p-7 rounded-3xl border border-[#1a1a1a] hover:border-[#c5a059]/30 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded bg-[#111] border border-[#222] ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.label}</h3>
            <p className="text-3xl font-serif font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#0c0c0c] p-8 rounded-3xl border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="font-serif text-xl font-bold text-white mb-1">Efficiency Metrics</h3>
               <p className="text-xs text-slate-500">Comparing high-touch client inquiries against automated AI resolution.</p>
            </div>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#c5a059] rounded-full"></div> Inquiries</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white/20 rounded-full"></div> AI Automations</div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderRadius: '16px', border: '1px solid #222', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '700' }}
                />
                <Area type="monotone" dataKey="intake" stroke="#c5a059" fillOpacity={1} fill="url(#colorIntake)" strokeWidth={3} />
                <Area type="monotone" dataKey="handled" stroke="#333" fill="#111" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="bg-[#0c0c0c] p-8 rounded-3xl border border-[#1a1a1a] flex flex-col">
          <h3 className="font-serif text-xl font-bold text-white mb-6">Partner Alerts</h3>
          <div className="flex-1 space-y-5">
            {[
              { title: 'Statute Deadline', detail: 'Case #2948 — 72 hours remaining', type: 'error' },
              { title: 'High-Value Engagement', detail: 'Sovereign Wealth Fund enquiry', type: 'warning' },
              { title: 'Security Protocol', detail: 'End-to-end encryption verified', type: 'info' }
            ].map((alert, i) => (
              <div key={i} className={`p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex gap-4 ${
                alert.type === 'error' ? 'bg-[#1a0a0a] border-red-900/30' :
                alert.type === 'warning' ? 'bg-[#1a150a] border-[#c5a059]/30' : 'bg-[#0a101a] border-blue-900/30'
              }`}>
                <Shield className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-[#c5a059]' : 'text-blue-500'
                }`} />
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{alert.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{alert.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[#c5a059] transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            Command Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
