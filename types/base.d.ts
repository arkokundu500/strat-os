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

export type ReducerStateType = {
  step: "input" | "syncing" | "dashboard";
  result: TwinResult | null;
  log: string;
}

export type ReducerAction = 
  | { type: "SET_STEP"; payload: ReducerStateType["step"] }
  | { type: "SET_RESULT"; payload: ReducerStateType["result"] }
  | { type: "SET_LOG"; payload: ReducerStateType["log"] };