
import React from 'react';
import { LBJSystem, SystemStatus } from './types';

export const SYSTEM_DEFS: Record<LBJSystem, SystemStatus> = {
  [LBJSystem.SALES]: {
    id: LBJSystem.SALES,
    name: 'Sales AI',
    status: 'idle',
    description: 'Leads, qualification, proposals, sales process',
    color: 'emerald-500'
  },
  [LBJSystem.DESIGN]: {
    id: LBJSystem.DESIGN,
    name: 'Design AI',
    status: 'idle',
    description: 'Creative direction, concepts, narratives',
    color: 'purple-500'
  },
  [LBJSystem.OPS]: {
    id: LBJSystem.OPS,
    name: 'Ops AI',
    status: 'idle',
    description: 'Operations, scheduling, delivery, risk',
    color: 'amber-500'
  },
  [LBJSystem.GROWTH]: {
    id: LBJSystem.GROWTH,
    name: 'Growth AI',
    status: 'idle',
    description: 'Marketing, branding, campaigns, content',
    color: 'blue-500'
  }
};
