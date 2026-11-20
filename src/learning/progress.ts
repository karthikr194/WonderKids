import { courses, type Language, type Lesson } from './curriculum';

interface Practice {
  attempts: number;
  correct: number;
  mastered: boolean;
}

export interface CourseProgress {
  current?: string;
  lessons: Record<string, Practice>;
  stars: number;
  xp: number;
  streak: number;
  lastPracticed?: string;
}
export type LearningProgress = Partial<Record<Language, CourseProgress>>;

export const emptyCourse = (): CourseProgress => ({ lessons: {}, stars: 0, xp: 0, streak: 0 });

export const progressKey = (childId: string) => `wonderkids:learning:v1:${childId}`;

export function readProgress(storage: Pick<Storage, 'getItem'>, childId: string): LearningProgress {
  try {
    const stored = JSON.parse(storage.getItem(progressKey(childId)) ?? '{}');
    return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  } catch {
    return {};
  }
}

export function saveProgress(storage: Pick<Storage, 'setItem'>, childId: string, progress: LearningProgress) {
  try {
    storage.setItem(progressKey(childId), JSON.stringify(progress));
  } catch { /* Keep the current session usable if storage is unavailable. */ }
}

const nextDate = (value: string) => {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
};

export function localDate(date = new Date()) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map(part => String(part).padStart(2, '0')).join('-');
}

export function recordAttempt(course: CourseProgress, lesson: Lesson, correct: boolean, complete: boolean, date: string): CourseProgress {
  const prior = course.lessons[lesson.id] ?? { attempts: 0, correct: 0, mastered: false };
  const earned = Number(correct && complete && !prior.mastered);
  return {
    ...course,
    lessons: { ...course.lessons, [lesson.id]: {
      attempts: prior.attempts + 1, correct: prior.correct + Number(correct), mastered: prior.mastered || Boolean(earned),
    } },
    stars: course.stars + earned,
    xp: course.xp + earned * 10,
    streak: course.lastPracticed === date ? course.streak
      : course.lastPracticed && nextDate(course.lastPracticed) === date ? course.streak + 1 : 1,
    lastPracticed: date,
  };
}

export function nextLesson(lesson: Lesson) {
  const pool = courses[lesson.language];
  return pool[pool.indexOf(lesson) + 1];
}
