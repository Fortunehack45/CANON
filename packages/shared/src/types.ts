export type DecisionType = 
  | 'architecture' 
  | 'performance' 
  | 'security' 
  | 'dependency' 
  | 'data_model' 
  | 'api_contract' 
  | 'infrastructure' 
  | 'refactor' 
  | 'bugfix' 
  | 'feature';

export type ImpactLevel = 'critical' | 'high' | 'medium' | 'low';

export interface DecisionExtraction {
  isDecision: boolean;
  title: string;
  summaryOneLiner: string;
  what: string;
  why: string;
  alternativesConsidered: string[];
  tradeoffs: string;
  decisionType: DecisionType;
  impact: ImpactLevel;
  tags: string[];
}
