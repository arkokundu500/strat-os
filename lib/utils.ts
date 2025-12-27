export function getRiskColor(level: string) {
  switch(level) {
    case "High": return "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]";
    case "Medium": return "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]";
    case "Low": return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]";
    default: return "bg-slate-500";
  }
}