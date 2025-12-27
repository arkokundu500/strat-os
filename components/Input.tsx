'use client'

import { motion } from "framer-motion"
import { GitMerge } from "lucide-react"

type InputType = {
	setFormData: React.Dispatch<React.SetStateAction<{
		companyName: string,
		context: string,
		options: string
	}>>
	formData: {
		companyName: string,
		context: string,
		options: string
	}
	handleSimulate: () => void
}

export default function Input({setFormData, formData, handleSimulate}: InputType) {
  return (
    <motion.div 
			key="input"
			initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
			className="max-w-2xl mx-auto space-y-8"
    >
			<div className="text-center space-y-4">
			<h2 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-500">
					Build Your Digital Twin.
			</h2>
			<p className="text-lg text-slate-400">
					Don't just guess. Create a living simulation of your company and competitors.
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
