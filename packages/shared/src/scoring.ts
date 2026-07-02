export function convertScoreTo100(value: number, scale: number): number {
  if (scale <= 1) return 0;
  const clampedVal = Math.max(1, Math.min(scale, value));
  return ((clampedVal - 1) / (scale - 1)) * 100;
}

export function getScoreCategory(score100: number): string {
  if (score100 >= 80) return 'Sangat Baik';
  if (score100 >= 60) return 'Baik';
  if (score100 >= 40) return 'Cukup';
  return 'Kurang';
}

interface AnswerInput {
  ratingValue: number | null | undefined;
  weight?: number | null;
}

export function calculateWeightedAverage(answers: AnswerInput[]): { scoreRaw: number; count: number } {
  let totalWeight = 0;
  let weightedSum = 0;
  let validCount = 0;

  for (const ans of answers) {
    if (ans.ratingValue === null || ans.ratingValue === undefined) {
      continue;
    }
    const weight = ans.weight !== null && ans.weight !== undefined ? Number(ans.weight) : 1.0;
    weightedSum += ans.ratingValue * weight;
    totalWeight += weight;
    validCount++;
  }

  if (totalWeight === 0) {
    return { scoreRaw: 0, count: 0 };
  }

  return {
    scoreRaw: weightedSum / totalWeight,
    count: validCount,
  };
}
