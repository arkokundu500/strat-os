'use client';

import { motion } from "framer-motion";

export default function Syncing({ log }: { log: string }) {
  return (
    <motion.div 
			key="syncing"
			initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
			className="flex flex-col items-center justify-center h-[60vh] text-center"
		>
			<div className="relative w-32 h-32 mb-8">
				<div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
				<div className="absolute inset-4 border-b-4 border-purple-500 rounded-full animate-spin box-decoration-clone"></div>
			</div>
			<h3 className="text-2xl font-bold text-white mb-2">Synchronizing Twin</h3>
			<p className="font-mono text-cyan-400 text-sm animate-pulse">{log}</p>
		</motion.div>
  )
}
