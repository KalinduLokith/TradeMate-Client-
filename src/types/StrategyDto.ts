export interface StrategyDto {
  id: number;
  name: string;
  type: string;
  comment?: string;
  description: string;
  marketType: string[] | null;
  marketCondition: string[] | null;
  riskLevel: string;
  winRate: number;
  totalTrades: number;
  lastModifiedDate: Date;
  userId: number;
  starRate?: number | 0;
}
