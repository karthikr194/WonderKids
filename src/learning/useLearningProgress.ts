import { useCallback, useEffect, useState } from 'react';
import { readProgress, saveProgress, type LearningProgress } from './progress';

export function useLearningProgress(childId: string) {
  const [progress, setProgress] = useState(() => readProgress(localStorage, childId));
  useEffect(() => saveProgress(localStorage, childId, progress), [childId, progress]);
  const update = useCallback((action: (current: LearningProgress) => LearningProgress) => setProgress(action), []);
  return { progress, update };
}
