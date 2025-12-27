'use client'

import { getRiskColor, Scenario, TwinResult } from "@/app/page";
import { ReactFlow, Background, Controls, Node, Edge, OnNodesChange, OnEdgesChange } from "@xyflow/react";
import { motion } from "framer-motion";
import { Swords, ShieldAlert, GitMerge, RefreshCw } from "lucide-react";

type DashboardType = {
	setStep: React.Dispatch<React.SetStateAction<"input" | "syncing" | "dashboard">>,
	result: TwinResult
	setSelectedScenario: React.Dispatch<React.SetStateAction<Scenario | null>>,
	nodes: Node[],
	edges: Edge[],
	onNodesChange: OnNodesChange<Node>,
	onEdgesChange: OnEdgesChange<Edge>,
}

export default function Dashboard({ setStep, result, setSelectedScenario, nodes, edges, onNodesChange, onEdgesChange }: DashboardType) {
  return (
    <motion.div 
			key="dashboard"
			initial={{ opacity: 0 }} animate={{ opacity: 1 }}
			className="space-y-8 pb-20"
		>
			{/* TOP ROW: COMPETITOR INTEL & STATS */}
			<div className="grid md:grid-cols-3 gap-6">
				
				{/* Competitor Card */}
				<div className="md:col-span-1 bg-linear-to-br from-red-950/40 to-black border border-red-900/50 rounded-2xl p-6 relative overflow-hidden">
					<div className="absolute top-0 right-0 p-4 opacity-20">
						<Swords className="w-24 h-24 text-red-500" />
					</div>
					<h3 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4">Primary Antagonist</h3>
					<div className="space-y-4 relative z-10">
						<div>
							<p className="text-2xl font-bold text-white">{result.competitor_profile.name}</p>
							<p className="text-sm text-red-200/60">{result.competitor_profile.archetype}</p>
						</div>
						<div className="bg-red-950/50 border border-red-500/20 p-3 rounded-lg">
							<p className="text-xs text-red-400 mb-1">PREDICTED COUNTER-MOVE</p>
							<p className="text-sm font-medium text-white">"{result.competitor_profile.likely_counter_move}"</p>
						</div>
						<div className="flex items-center gap-2 text-xs">
								<ShieldAlert className="w-4 h-4 text-red-500" />
								Threat Level: <span className="font-bold text-white">{result.competitor_profile.threat_level}</span>
						</div>
					</div>
				</div>

				{/* Scenario Comparison */}
				<div className="md:col-span-2 grid grid-cols-2 gap-4">
					{result.scenarios.map((scen) => (
						<div 
							key={scen.id}
							onClick={() => setSelectedScenario(scen)} 
							className={`p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group
								${scen.id === result.recommended_id 
									? "bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]" 
									: "bg-white/5 border-white/10 hover:border-white/20"}`}
						>
							<div className="flex justify-between mb-3">
								<span className="text-xs font-bold text-slate-400 group-hover:text-white transition">SCENARIO {scen.id}</span>
								{scen.id === result.recommended_id && <span className="text-[10px] bg-cyan-500 text-black font-bold px-2 py-0.5 rounded">RECOMMENDED</span>}
							</div>
							<h4 className="font-bold text-white mb-2">{scen.title}</h4>
							<p className="text-xs text-slate-400 mb-4 line-clamp-2">{scen.outcome_12m}</p>
							
							{/* Mini Matrix Preview */}
							{scen.risk_matrix && (
								<div className="grid grid-cols-4 gap-1 mt-4">
										<div className={`h-1 rounded-full ${getRiskColor(scen.risk_matrix.financial)}`}></div>
										<div className={`h-1 rounded-full ${getRiskColor(scen.risk_matrix.legal)}`}></div>
										<div className={`h-1 rounded-full ${getRiskColor(scen.risk_matrix.market)}`}></div>
										<div className={`h-1 rounded-full ${getRiskColor(scen.risk_matrix.brand)}`}></div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* BOTTOM ROW: INTERACTIVE FLOWCHART */}
			<div className="h-125 bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden relative">
					<div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
					<h3 className="text-sm font-bold text-white flex items-center gap-2">
						<GitMerge className="w-4 h-4 text-cyan-400" /> Implementation Blueprint
					</h3>
				</div>
				<ReactFlow 
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					proOptions={{
						hideAttribution: true
					}}
					fitView
					attributionPosition="bottom-right"
					className="bg-black"
					colorMode="dark"
				>
					<Background color="#334155" gap={20} />
					<Controls className="bg-slate-800 border-slate-700 fill-white" />
				</ReactFlow>
			</div>

			<button onClick={() => setStep("input")} className="mx-auto flex items-center gap-2 text-slate-500 hover:text-white transition">
				<RefreshCw className="w-4 h-4" /> Reset Twin
			</button>

		</motion.div>
  )
}
