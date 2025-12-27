"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useNodesState, 
  useEdgesState, 
  type Node, 
  type Edge 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getLayoutedElements } from "@/lib/layout"; 
import { Activity, Swords, X, Calendar, AlertTriangle, DollarSign, Scale, Globe, Award } from "lucide-react";
import Input from "@/components/Input";
import Syncing from "@/components/Syncing";
import Dashboard from "@/components/Dashboard";
import { BsGithub, BsYoutube } from "react-icons/bs";
import Link from "next/link";

// --- TYPES ---
interface FlowData { nodes: Node[]; edges: Edge[]; }

export interface Scenario {
  id: string;
  title: string;
  outcome_3m: string;
  outcome_12m: string;
  risk_score: number;
  competitor_reaction: string;
  risk_matrix: {
    financial: "Low" | "Medium" | "High";
    legal: "Low" | "Medium" | "High";
    market: "Low" | "Medium" | "High";
    brand: "Low" | "Medium" | "High";
  };
}

export interface TwinResult {
  twin_status: string;
  competitor_profile: {
    name: string;
    archetype: string;
    likely_counter_move: string;
    threat_level: string;
  };
  scenarios: Scenario[];
  recommended_id: string;
  implementation_flowchart: FlowData;
}

export default function LivingStrategicTwin() {
  const [step, setStep] = useState<"input" | "syncing" | "dashboard">("input");
  const [formData, setFormData] = useState({ companyName: "", context: "", options: "" });
  const [result, setResult] = useState<TwinResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [log, setLog] = useState("");

  const handleSimulate = async () => {
    setStep("syncing");
    
    const logs = ["Connecting to Market API...", "Ingesting Competitor 10-K Filings...", "Calibrating Game Theory Weights...", "Building Digital Twin Model..."];
    let i = 0;
    const interval = setInterval(() => { setLog(logs[i++ % logs.length]); }, 1200);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      const initialNodes: Node[] = data.implementation_flowchart.nodes.map((n: any) => ({ 
        id: n.id,
        position: { x: 0, y: 0 }, 
        data: { label: n.label },
        type: n.type || 'default',
        style: { 
          background: '#0f172a', 
          color: '#fff', 
          border: '1px solid #334155', 
          borderRadius: '8px', 
          padding: '10px', 
          fontSize: '12px',
          width: 150 
        } 
      }));

      const initialEdges: Edge[] = data.implementation_flowchart.edges.map((e: Edge) => ({ 
        id: `e${e.source}-${e.target}`,
        source: e.source, 
        target: e.target, 
        animated: true, 
        label: e.label,
        style: { stroke: '#06b6d4' },
        labelStyle: { fill: '#94a3b8', fontSize: 10 }
      }));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setResult(data);
      setStep("dashboard");
    } catch (e) {
      console.error(e);
      alert("Twin Sync Failed. Check console for details.");
      setStep("input");
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-cyan-300 tracking-tight">StratOS</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">The Operating System for Strategic Intelligence</p>
            </div>
          </div>
          {step === "dashboard" && (
            <div className="ml-auto flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-500/20 animate-pulse">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              LIVE MODEL SYNCED
            </div>
          )}
          <div className="flex items-center gap-8 text-slate-500 *:relative text-xl">
            <Link href="https://github.com/arkokundu500/strat-os" target="_blank" className="group/github">
              <BsGithub className="hover:text-white transition-colors" />
              <span className="sr-only">Open GitHub Repository</span>
              <div className="absolute top-full group-hover/github:top-[calc(100%+12px)] text-xs text-center bg-white text-black py-1 px-1 rounded-2xl w-24 -z-10 left-1/2 -translate-x-1/2 pointer-events-none transition-all opacity-0 group-hover/github:opacity-100">
                Open Source Code
              </div>
            </Link>
            <Link href="https://youtu.be/YRpLNCWM_Jg" target="_blank" className="group/youtube">
              <BsYoutube className="hover:text-red-500 transition-colors" />
              <span className="sr-only">Open YouTube Demo Video</span>
              <div className="absolute top-full group-hover/youtube:top-[calc(100%+12px)] text-xs text-center bg-white text-black py-1 px-1 rounded-2xl w-24 -z-10 left-1/2 -translate-x-1/2 pointer-events-none transition-all opacity-0 group-hover/youtube:opacity-100">
                Watch Demo
              </div>
            </Link>
          </div>
          
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          
          {/* INPUT MODE */}
          {step === "input" && <Input setFormData={setFormData} formData={formData} handleSimulate={handleSimulate} />}

          {/* SYNCING MODE */}
          {step === "syncing" && <Syncing log={log} />}

          {/* DASHBOARD MODE */}
          {step === "dashboard" && result && (
            <Dashboard
              result={result}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              setStep={setStep}
              setSelectedScenario={setSelectedScenario}
            />
          )}
        </AnimatePresence>

        {/* --- SCENARIO DETAIL MODAL --- */}
        <AnimatePresence>
          {selectedScenario && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedScenario(null)}
              className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0f172a] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded">SCENARIO {selectedScenario.id}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{selectedScenario.title}</h2>
                  </div>
                  <button onClick={() => setSelectedScenario(null)} className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto space-y-8">
                  
                  {/* --- THE VISUAL RISK HEATMAP --- */}
                  {selectedScenario.risk_matrix && (
                    <div>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-4 uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" /> Comprehensive Risk Matrix
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <RiskCard icon={<DollarSign className="w-5 h-5"/>} label="Financial" level={selectedScenario.risk_matrix.financial} />
                        <RiskCard icon={<Scale className="w-5 h-5"/>} label="Legal" level={selectedScenario.risk_matrix.legal} />
                        <RiskCard icon={<Globe className="w-5 h-5"/>} label="Market" level={selectedScenario.risk_matrix.market} />
                        <RiskCard icon={<Award className="w-5 h-5"/>} label="Brand" level={selectedScenario.risk_matrix.brand} />
                      </div>
                    </div>
                  )}

                  {/* Competitor War Game */}
                  <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-3 uppercase">
                      <Swords className="w-4 h-4" /> Game Theory Analysis
                    </div>
                    <p className="text-slate-200 leading-relaxed">{selectedScenario.competitor_reaction}</p>
                  </div>

                  {/* Timeline */}
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-4 uppercase">
                      <Calendar className="w-4 h-4" /> Outcomes
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                        <span className="text-xs text-cyan-500 font-bold block mb-2">3 MONTHS</span>
                        <p className="text-sm text-slate-300">{selectedScenario.outcome_3m}</p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                        <span className="text-xs text-purple-500 font-bold block mb-2">12 MONTHS</span>
                        <p className="text-sm text-slate-300">{selectedScenario.outcome_12m}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

export function getRiskColor(level: string) {
  switch(level) {
    case "High": return "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]";
    case "Medium": return "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]";
    case "Low": return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]";
    default: return "bg-slate-500";
  }
}

function RiskCard({ icon, label, level }: { icon: any, label: string, level: string }) {
  const colorClass = getRiskColor(level);
  
  return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-slate-700 transition">
          <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-800 text-slate-300`}>{icon}</div>
              <span className="font-medium text-slate-200">{label}</span>
          </div>
          <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 uppercase font-bold">{level} Risk</span>
              <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
          </div>
      </div>
  );
}