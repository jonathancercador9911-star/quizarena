export function calculateScore(
  isCorrect: boolean,
  responseMs: number,
  timePerQuestionMs: number
): number {
  if (!isCorrect) return 0;
  const speedBonus = Math.round(
    500 * Math.max(0, 1 - responseMs / timePerQuestionMs)
  );
  return 1000 + speedBonus;
}
