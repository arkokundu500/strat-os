"use client";

import { useReducer, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { 
  useNodesState, 
  useEdgesState, 
  type Node, 
  type Edge 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Activity } from "lucide-react";
import Input from "@/components/Input";
import Syncing from "@/components/Syncing";
import Dashboard from "@/components/Dashboard";
import { BsGithub, BsYoutube } from "react-icons/bs";
import Link from "next/link";
import ScenarioModal from "@/components/ScenarioModal";
import { ReducerAction, ReducerStateType, Scenario } from "@/types/base";

const initialState: ReducerStateType = {
  step: "input",
  result: null,
  log: ""
}

const reducer = (state: ReducerStateType, action: ReducerAction): ReducerStateType => {
  switch(action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_RESULT":
      return { ...state, result: action.payload };
    case "SET_LOG":
      return { ...state, log: action.payload };
    default:
      return state;
  }
};

export default function LivingStrategicTwin() {
  const [{ step, result, log }, setState] = useReducer(reducer, initialState)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

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
          {
            step === "input" && (
              <Input
                setState={setState}
                setNodes={setNodes}
                setEdges={setEdges}
              />
            )
          }

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
              setStep={
                (payload: ReducerStateType['step']) => setState({ type: "SET_STEP", payload })
              }
              setSelectedScenario={setSelectedScenario}
            />
          )}
        </AnimatePresence>

        {/* --- SCENARIO DETAIL MODAL --- */}
        <ScenarioModal
          selectedScenario={selectedScenario}
          setSelectedScenario={setSelectedScenario}
        />
      </main>
    </div>
  );
}