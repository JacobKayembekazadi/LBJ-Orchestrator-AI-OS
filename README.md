<div align="center">

<h1>🤖 Multi-Agent Business OS</h1>
<p><strong>An orchestration layer that coordinates specialized AI agents across growth, ops, sales, and design.</strong></p>

[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Built by Sloe Labs](https://img.shields.io/badge/Built_by-Sloe_Labs-black.svg)](https://sloelabs.com)

</div>

---

## Concept

Most businesses run 4-6 disconnected tools to manage growth, operations, design, and sales. This is a proof-of-concept for collapsing that into a single AI-native interface — where each domain has a specialized agent, and a central orchestrator routes tasks intelligently between them.

---

## Agents

| Agent | Domain | Capabilities |
|-------|--------|-------------|
| **Growth Agent** | Marketing & pipeline | Lead scoring, campaign analysis, funnel diagnostics |
| **Design Agent** | Brand & creative | Visual briefs, design decisions, brand consistency checks |
| **Ops Agent** | Operations | Process bottlenecks, resource allocation, system health |
| **Sales Agent** | Revenue | Prospect research, outreach drafts, deal tracking |

---

## How it works

```
User input
  └── Orchestrator (classifies intent)
        ├── Growth Agent  ← marketing/pipeline queries
        ├── Design Agent  ← visual/brand queries  
        ├── Ops Agent     ← operational queries
        └── Sales Agent   ← revenue/prospect queries
```

Each agent maintains its own context window and system prompt. The orchestrator ensures shared state is passed correctly between agents on multi-step tasks.

---

## Stack

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini-4285F4?style=flat&logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## Local setup

```bash
git clone https://github.com/JacobKayembekazadi/LBJ-Orchestrator-AI-OS
cd LBJ-Orchestrator-AI-OS
npm install
# Add GEMINI_API_KEY to .env
npm run dev
```

---

<div align="center">
<sub>Concept build · <a href="https://sloelabs.com">Sloe Labs</a></sub>
</div>