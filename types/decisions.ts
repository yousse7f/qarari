export type Option = {
  id: string;
  name: string;
  ratings: Record<string, number>;
};

export type Criterion = {
  id: string;
  name: string;
};

export type ResultItem = {
  option: Option;
  score: number;
  criteriaScores: Record<string, number>;
};

export type Results = {
  optionScores: ResultItem[];
  highestPossibleScore: number;
};

export type Decision = {
  id: string;
  title: string;
  description?: string;
  options: Option[];
  criteria: Criterion[];
  results: Results;
  createdAt: string;
};