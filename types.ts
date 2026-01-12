
export enum LBJSystem {
  SALES = 'LBJ-Sales-AI',
  DESIGN = 'LBJ-Design-AI',
  OPS = 'LBJ-Ops-AI',
  GROWTH = 'LBJ-Growth-AI'
}

export interface SystemStatus {
  id: LBJSystem;
  name: string;
  status: 'idle' | 'active' | 'offline';
  description: string;
  color: string;
}

export interface OrchestratorBrief {
  userIntent: string;
  keyContext: string;
  recommendedSystems: LBJSystem[];
  reasonForRouting: string;
}

export interface UsageGuide {
  systemToOpen: string;
  whatToPasteOrUpload: string;
  whatThisSystemWillDo: string;
  whatYoullGetAtTheEnd: string;
}

export interface Message {
  id: string;
  role: 'user' | 'orchestrator';
  text?: string;
  brief?: OrchestratorBrief;
  usageGuide?: UsageGuide;
  timestamp: Date;
  fileName?: string;
}
