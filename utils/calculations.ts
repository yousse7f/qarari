import { Option, Criterion, Results, ResultItem } from '@/types/decisions';

export function calculateResults(options: Option[], criteria: Criterion[]): Results {
  // Calculate the maximum possible score (if all options got 10 on all criteria)
  const highestPossibleScore = criteria.length * 10;
  
  // Calculate scores for each option
  const optionScores: ResultItem[] = options.map(option => {
    const criteriaScores: Record<string, number> = {};
    let totalScore = 0;
    
    // Calculate score for each criterion
    criteria.forEach(criterion => {
      const rating = option.ratings[criterion.id] || 0;
      
      criteriaScores[criterion.id] = rating;
      totalScore += rating;
    });
    
    return {
      option,
      score: totalScore,
      criteriaScores
    };
  });
  
  // Sort options by score (highest first)
  optionScores.sort((a, b) => b.score - a.score);
  
  return {
    optionScores,
    highestPossibleScore
  };
}

export function calculatePercentage(score: number, highestPossible: number): number {
  return (score / highestPossible) * 100;
}