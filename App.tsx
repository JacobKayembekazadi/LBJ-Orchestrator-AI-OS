
import React, { useState, useRef, useEffect } from 'react';
import { LBJSystem, Message, SystemStatus } from './types';
import { SYSTEM_DEFS } from './constants';
import { processOrchestration } from './services/geminiService';
import { SystemStatusCard } from './components/SystemStatusCard';
import { BriefView } from './components/BriefView';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systems, setSystems] = useState<Record<LBJSystem, SystemStatus>>(SYSTEM_DEFS);
  const [selectedFile, setSelectedFile] = useState<{ name: string, data: string, mimeType: string } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedFile({
        name: file.name,
        data: base64.split(',')[1],
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      fileName: selectedFile?.name,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await processOrchestration(inputValue, selectedFile ? { data: selectedFile.data, mimeType: selectedFile.mimeType } : undefined);
      
      // Update system statuses
      const newSystems = { ...SYSTEM_DEFS };
      result.brief.recommendedSystems.forEach((sys: LBJSystem) => {
        if (newSystems[sys]) {
          newSystems[sys].status = 'active';
        }
      });
      setSystems(newSystems);

      const orchestratorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'orchestrator',
        brief: result.brief,
        usageGuide: result.usageGuide,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, orchestratorMessage]);
      setSelectedFile(null); // Reset file after processing

      // Return systems to idle after a delay
      setTimeout(() => {
        setSystems(SYSTEM_DEFS);
      }, 5000);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'orchestrator',
        text: "ORCHESTRATOR ERROR: Failed to route request. Check connection and file format.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <aside className="w-80 border-r border-slate-800 flex flex-col hidden lg:flex bg-[#03081a]">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse"></div>
            <h1 className="text-lg font-bold tracking-tight text-white">LBJ-OS CORE</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Orchestrator v3.2.0</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Specialist Grid</span>
          </div>
          {(Object.values(systems) as SystemStatus[]).map(sys => (
            <SystemStatusCard key={sys.id} system={sys} />
          ))}
        </div>

        <div className="p-6 border-t border-slate-800 bg-[#020617]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
              <span className="text-xs font-bold text-slate-400">OS</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">System Intake Node</p>
              <p className="text-[10px] text-slate-500">Multimodal Routing: ACTIVE</p>
            </div>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[96%]"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-right">96% Accuracy Confidence</p>
        </div>
      </aside>

      {/* Main Orchestration Area */}
      <main className="flex-1 flex flex-col bg-[#020617] relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="lg:hidden text-emerald-500 font-bold">LBJ-OS</div>
            <div className="h-6 w-px bg-slate-800 hidden lg:block"></div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              MASTER INTAKE PROTOCOL ENABLED
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-12 space-y-8 scroll-smooth z-10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8">
              <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mb-4 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-[#020617] animate-pulse">
                  <span className="text-[10px] font-bold">OS</span>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tight text-white">Welcome to the LBJ AI OS</h2>
                <p className="text-slate-400 text-lg leading-relaxed font-mono">
                  You can either: <br/>
                  <span className="text-emerald-500">1) Type your request</span><br/>
                  <span className="text-blue-500">2) Upload a file (brief, notes, leads, ideas)</span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
                {[
                  "Process these leads and draft qualification steps",
                  "Create a creative concept for a luxury brand refresh",
                  "Audit my project timeline and identify risks",
                  "Draft a multi-channel campaign for a Q3 product launch"
                ].map(prompt => (
                  <button 
                    key={prompt}
                    onClick={() => setInputValue(prompt)}
                    className="p-5 bg-slate-900/30 border border-slate-800 rounded-xl text-left text-sm text-slate-400 hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all group"
                  >
                    <span className="block text-[10px] font-bold text-slate-600 mb-1 group-hover:text-emerald-500 transition-colors uppercase tracking-widest">Standard Request</span>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-emerald-600/5 border border-emerald-500/20 px-8 py-5 rounded-2xl text-emerald-50' : 'w-full'}`}>
                {msg.role === 'user' ? (
                  <div className="space-y-3">
                    {msg.fileName && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">{msg.fileName}</span>
                      </div>
                    )}
                    <p className="text-base font-medium leading-relaxed">{msg.text}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {msg.text ? (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-200 rounded-xl font-mono text-xs">
                        {msg.text}
                      </div>
                    ) : (
                      <>
                        {msg.brief && msg.usageGuide && (
                          <BriefView brief={msg.brief} usageGuide={msg.usageGuide} />
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl flex items-center gap-5">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-225"></div>
                </div>
                <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest font-bold">Analyzing Intent & Routing Specialists...</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Input Console */}
        <div className="p-6 md:p-8 bg-[#020617]/90 backdrop-blur-2xl border-t border-slate-800 z-20">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4">
            {selectedFile && (
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-500/20 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Attachment Staged</p>
                    <p className="text-xs text-slate-300 font-mono">{selectedFile.name}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedFile(null)}
                  className="p-1 hover:bg-emerald-500/20 rounded-full transition-colors text-emerald-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}

            <div className="relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={selectedFile ? "What outcome do you want from this file?" : "Type request or instructions for routing..."}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 pl-16 pr-36 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all placeholder:text-slate-600 font-medium"
                disabled={isLoading}
              />
              
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*,application/pdf,text/plain"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2.5 rounded-xl transition-all ${selectedFile ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                  title="Upload Brief or Context File"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </button>
              </div>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed group-active:scale-95"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-xs uppercase tracking-widest">Intake</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          <div className="flex justify-center items-center gap-6 mt-6">
            <span className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">SECURE CHANNEL 04</span>
            <div className="h-px w-24 bg-slate-900"></div>
            <span className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">LBJ GLOBAL ORCHESTRATION</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
