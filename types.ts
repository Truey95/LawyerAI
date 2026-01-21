
export interface CaseFile {
  id: string;
  clientName: string;
  incidentDate: string;
  incidentType: string;
  description: string;
  analysis: string;
  winningRatio: number;
  status: 'Draft' | 'Open' | 'Closed';
}

export interface ClientInteraction {
  id: string;
  clientName: string;
  channel: 'Email' | 'Text' | 'Call';
  summary: string;
  timestamp: string;
  aiResponse: string;
}

export enum AppTab {
  Dashboard = 'dashboard',
  VoiceIntake = 'intake',
  ClientCare = 'care',
  LegalResearch = 'research',
  CreativeStudio = 'creative',
  ComplexReasoning = 'reasoning'
}
