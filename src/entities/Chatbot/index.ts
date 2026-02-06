// ===== Session DTOs =====
export interface SessionDTO {
    sessionId: string;
    topic: string;
    createdAt: string;
    messageCount: number;
}

export interface CreateSessionRequest {
    topic?: string;
}

// ===== Chat DTOs =====
export interface SendMessageRequest {
    sessionId: string;
    message: string;
}

export interface ChatResponse {
    response: string;
    toolsUsed: string[];
    analysisData: Record<string, unknown> | null;
}

// ===== History DTOs =====
export interface MessageHistory {
    role: 'user' | 'assistant';
    content: string;
    toolsUsed: string[];
    timestamp: string;
}

export interface ConversationHistory {
    sessionId: string;
    topic: string;
    messages: MessageHistory[];
}

// ===== Analysis Data Types =====
export interface EquationBalancingResult {
    original: string;
    balanced: string;
    coefficients: Record<string, number>;
    success: boolean;
}

export interface MolecularAnalysisResult {
    formula: string;
    name: string;
    molarMass: number;
    state: string;
}

export interface ReactionCheckResult {
    canReact: boolean;
    explanation: string;
    product: string;
}

// ===== Tool Types =====
export type ChatToolType =
    | 'EquationBalancer'
    | 'MolecularAnalyzer'
    | 'ReactionChecker'
    | 'GeneralAI';
