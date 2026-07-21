export interface AIMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface AIState {
  messages: AIMessage[];
  loading: boolean;
  error: string | null;
  aiStatus: "ready" | "analyzing" | "offline";
  analyzedTransactionsCount: number;
  savingsPotential: number;
  financialScore: number;
  insights: string[];
}
