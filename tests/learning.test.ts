import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { courses, lessonOptions } from '../src/learning/curriculum';
import { emptyCourse, nextLesson, readProgress, recordAttempt, saveProgress } from '../src/learning/progress';
import { mayUseDeviceSpeech, pickVoice } from '../src/learning/voices';

test('required alphabets, matras and Tamil compound matrix are complete', () => {
  assert.equal(courses.en.filter(item => item.id.startsWith('en-abc-')).map(item => item.letter).join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const counts = [
    ['hi-swar-', 13], ['hi-vyanjan-', 33], ['hi-conjuncts-', 4], ['hi-matras-', 10],
    ['ta-uyir-', 12], ['ta-mei-', 18], ['ta-compound-', 216], ['ta-aytham-', 1],
  ] as const;
  const lessons = Object.values(courses).flat();
  for (const [prefix, count] of counts) assert.equal(lessons.filter(item => item.id.startsWith(prefix)).length, count);
  assert.equal(new Set(lessons.map(item => item.id)).size, lessons.length);
  assert.equal(new Set(courses.ta.filter(item => item.id.startsWith('ta-compound-')).map(item => item.letter)).size, 216);
});

test('referenced pictures exist and quiz answers are distinct', () => {
  for (const lesson of Object.values(courses).flat()) {
    if (lesson.picture) {
      for (const size of [128, 208]) assert.ok(existsSync(`public/learning/pictures/${lesson.picture}-${size}.webp`), lesson.picture);
    }
    for (const pictures of lesson.picture ? [false, true] : [false]) {
      const choices = lessonOptions(lesson, pictures);
      assert.equal(choices.length, 3, lesson.id);
      assert.equal(new Set(choices.map(choice => pictures ? choice.picture : choice.letter)).size, 3, lesson.id);
      assert.ok(choices.includes(lesson), lesson.id);
    }
  }
});

test('progression follows the course, awards mastery once, and counts consecutive days', () => {
  const [first, second] = courses.en;
  assert.equal(nextLesson(first), second);
  assert.equal(nextLesson(courses.en.at(-1)!), undefined);
  let result = recordAttempt(emptyCourse(), first, false, false, '2026-11-19');
  result = recordAttempt(result, first, true, false, '2026-11-19');
  assert.equal(result.stars, 0);
  result = recordAttempt(result, first, true, true, '2026-11-19');
  result = recordAttempt(result, first, true, true, '2026-11-20');
  assert.equal(result.stars, 1);
  assert.equal(result.xp, 10);
  assert.equal(result.streak, 2);
  assert.deepEqual(result.lessons[first.id], { attempts: 4, correct: 3, mastered: true });
});

test('course progress persists independently for each child', () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  const progress = { hi: { ...emptyCourse(), current: courses.hi[1].id }, ta: emptyCourse() };
  saveProgress(storage, 'kid-one', progress);
  assert.deepEqual(readProgress(storage, 'kid-two'), {});
  assert.deepEqual(readProgress(storage, 'kid-one'), progress);
});

test('audio fallback requires a matching locale and never substitutes letter names for isolated sounds', () => {
  const en = { lang: 'en-IN', localService: true };
  const hi = { lang: 'hi-IN', localService: false };
  const ta = { lang: 'ta_IN', localService: true };
  assert.equal(pickVoice([en, hi, ta], 'ta-IN', true), ta);
  assert.equal(pickVoice([en, hi], 'hi-IN', false), hi);
  assert.equal(pickVoice([en, hi], 'hi-IN', true), undefined);
  assert.equal(mayUseDeviceSpeech('sound'), false);
  assert.equal(mayUseDeviceSpeech('word'), true);
});
