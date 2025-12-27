'use client'

import { ReducerAction } from "@/types/base"
import { getLayoutedElements } from "@/lib/layout"
import { Node, Edge } from "@xyflow/react"
import { motion } from "framer-motion"
import { GitMerge } from "lucide-react"
import { useState } from "react"

type InputType = {
	setState: React.Dispatch<ReducerAction>
	setNodes: React.Dispatch<React.SetStateAction<Node[]>>
	setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
}

export default function Input({ setState, setNodes, setEdges }: InputType) {
	const [formData, setFormData] = useState({ companyName: "", context: "", options: "" });
	
	const handleSimulate = async () => {
    setState({ type: "SET_STEP", payload: "syncing" });
    
    const logs = ["Connecting to Market API...", "Ingesting Competitor 10-K Filings...", "Calibrating Game Theory Weights...", "Building Digital Twin Model..."];
    let i = 0;
    const interval = setInterval(() => { setState({ type: "SET_LOG", payload: logs[i++ % logs.length] }); }, 1200);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      const initialNodes: Node[] = data.implementation_flowchart.nodes.map(
        (n: {id: string; label: string; type?: string;}) => ({ 
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
        })
      );

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
      setState({ type: "SET_RESULT", payload: data });
      setState({ type: "SET_STEP", payload: "dashboard" });
    } catch (e) {
      console.error(e);
      alert("Twin Sync Failed. Check console for details.");
      setState({ type: "SET_STEP", payload: "input" });
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <motion.div 
			key="input"
			initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
			className="max-w-2xl mx-auto space-y-8"
    >
			<div className="text-center space-y-4">
			<h1 className="text-5xl leading-14 font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-500">
					Build Your Digital Twin
			</h1>
			<p className="text-lg text-slate-400">
					Don&apos;t just guess. Create a living simulation of your company and competitors.
			</p>
			</div>

			<div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 backdrop-blur-sm">
			<div className="space-y-2">
				<label className="text-xs font-bold text-slate-500 uppercase">Company Profile</label>
				<input 
					placeholder="e.g. Netflix"
					className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition"
					onChange={e => setFormData({...formData, companyName: e.target.value})}
				/>
			</div>
			<div className="space-y-2">
				<label className="text-xs font-bold text-slate-500 uppercase">Strategic Context</label>
				<textarea 
					placeholder="e.g. Disney+ just lowered prices. Subscriber growth is flat."
					className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white h-24 resize-none focus:border-cyan-500 outline-none transition"
					onChange={e => setFormData({...formData, context: e.target.value})}
				/>
			</div>
			<div className="space-y-2">
				<label className="text-xs font-bold text-slate-500 uppercase">Options to Simulate</label>
				<textarea 
					placeholder="e.g. 1. Lower prices. 2. Buy sports rights."
					className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white h-24 resize-none focus:border-cyan-500 outline-none transition"
					onChange={e => setFormData({...formData, options: e.target.value})}
				/>
			</div>
			<button 
				onClick={handleSimulate}
				disabled={!formData.companyName}
				className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(8,145,178,0.4)] flex items-center justify-center gap-2"
			>
				<GitMerge className="w-5 h-5" /> Initialize Twin
			</button>
			</div>
    </motion.div>
  )
}
