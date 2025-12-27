'use client'

import { Scenario } from "@/types/base"
import { getRiskColor } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { X, AlertTriangle, DollarSign, Scale, Globe, Award, Swords, Calendar } from "lucide-react"

type ModalProps = {
  selectedScenario: Scenario | null,
  setSelectedScenario: React.Dispatch<React.SetStateAction<Scenario | null>>
}

export default function ScenarioModal({ selectedScenario, setSelectedScenario }: ModalProps) {
  return (
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
  )
}

function RiskCard({ icon, label, level }: { icon: React.ReactNode, label: string, level: string }) {
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