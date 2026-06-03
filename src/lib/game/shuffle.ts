// Shuffle determinista usando el ID del round como semilla.
// Garantiza que todos los jugadores vean el mismo orden aleatorio
// y que la validación de respuestas sea consistente.

const OPTIONS = ["A", "B", "C", "D"] as const;

function seededHash(seed: string, index: number): number {
  let hash = index * 2654435761;
  for (let c = 0; c < seed.length; c++) {
    hash ^= seed.charCodeAt(c);
    hash = Math.imul(hash, 2246822519);
    hash ^= hash >>> 13;
  }
  return Math.abs(hash);
}

export function getShuffledOptions(
  question: {
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
  },
  seed: string
) {
  const values = [question.optionA, question.optionB, question.optionC, question.optionD];
  const indices = [0, 1, 2, 3];

  // Fisher-Yates con semilla determinista
  for (let i = indices.length - 1; i > 0; i--) {
    const j = seededHash(seed, i) % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const correctIndex = OPTIONS.indexOf(question.correctOption as "A" | "B" | "C" | "D");
  const newCorrectPosition = indices.indexOf(correctIndex);

  return {
    optionA: values[indices[0]],
    optionB: values[indices[1]],
    optionC: values[indices[2]],
    optionD: values[indices[3]],
    shuffledCorrectOption: OPTIONS[newCorrectPosition],
  };
}
