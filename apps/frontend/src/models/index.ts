export type ActionType = 'A' | 'B' | 'C';

export interface Action {
  type: ActionType;
  title: string;
  timestamp: Date;
}

export interface Credit {
  type: ActionType;
  value: number;
  max: number;
  lastUpdated: Date;
}
