import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Check, ChevronLeft, ChevronRight, Users, Volume2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MascotSays } from '../components/ui/Mascot';
import { FeedbackSheet } from '../components/ui/RoundSummary';
import { playPhoneme, speak, speakSequence, stopSpeaking } from '../lib/speech';
import { sfx } from '../lib/sfx';
import { burst } from '../lib/confetti';
import { PHONEME_BY_GRAPHEME, sayUnit } from '../data/phonics';
import {
  guidedKey, guidedLessons, markComplete, readCompleted, writeCompleted,
  type GuidedLesson, type GuidedSubject,
} from '../data/guidedLessons';
import type { ModeDef, ModeProps } from '../types';

const STEPS = ['Learn', 'Together', 'Your turn'] as const;

const storage = () => {
  try { return window.localStorage; } catch { return undefined; }
};

function GuidedCourse({ subject, user, onResult }: Pick<ModeProps, 'user' | 'onResult'> & { subject: GuidedSubject }) {
  const course = guidedLessons[subject];
  const key = guidedKey(user.id ?? 'original', subject);
  const [completed, setCompleted] = useState<string[]>(() => readCompleted(storage(), key, subject));
  const [saveFailed, setSaveFailed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => () => stopSpeaking(), []);

  const complete = (lesson: GuidedLesson) => {
    if (completed.includes(lesson.id)) return;
    const next = markComplete(completed, lesson.id);
    setCompleted(next);
    onResult(true); // a star the first time each lesson is finished
    if (!writeCompleted(storage(), key, next)) setSaveFailed(true);
  };

  const open = (i: number | null) => {
    stopSpeaking();
    setSelected(i);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selected !== null) {
    return (
      <LessonPlayer
        key={course[selected].id}
        lesson={course[selected]}
        subject={subject}
        number={selected + 1}
        total={course.length}
        done={completed.includes(course[selected].id)}
        onComplete={complete}
        onAllLessons={() => open(null)}
        onNext={() => open(selected + 1 < course.length ? selected + 1 : null)}
        isLast={selected + 1 >= course.length}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl pb-10">
      <div className="mb-5">
        <MascotSays>
          {subject === 'phonics'
            ? 'Six sounds, then we slide them together to read our first words!'
            : 'Small lessons for speaking, naming, moving and reading.'}
        </MascotSays>
      </div>

      <div className="chunky-sm mb-5 flex items-start gap-3 rounded-3xl bg-accent-soft p-4">
        <Users className="mt-0.5 shrink-0 text-accent-deep" size={24} />
        <p className="text-base font-semibold leading-snug">
          <b>Grown-up guide:</b> each lesson goes <b>Learn → Together → Your turn</b>.
          {subject === 'phonics'
            ? ' Teach the sound, not the letter name, and model pure sounds without adding “uh”.'
            : ' Read the steps aloud together and take turns.'}
        </p>
      </div>

      <div className="mb-3 flex items-center justify-between px-1 text-sm font-bold text-ink-soft">
        <span>{completed.length} of {course.length} lessons complete</span>
        <span className="h-2.5 w-32 overflow-hidden rounded-full bg-ink/10">
          <span className="block h-full rounded-full bg-accent transition-all" style={{ width: `${(completed.length / course.length) * 100}%` }} />
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {course.map((lesson, i) => {
          const done = completed.includes(lesson.id);
          return (
            <motion.button
              key={lesson.id}
              data-lesson={lesson.id}
              type="button"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => open(i)}
              className={`chunky flex items-center gap-3.5 rounded-3xl p-3.5 text-left ${done ? 'bg-good-soft' : 'bg-paper'}`}
            >
              <span className="chunky-sm flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-3xl" aria-hidden>{lesson.visual}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-black uppercase tracking-wide text-accent-deep">
                  Lesson {i + 1} · {lesson.blend ? 'Blending' : subject === 'phonics' ? 'Letter sound' : 'English'}
                </span>
                <span className="block text-xl font-black leading-tight">{lesson.title}</span>
                <span className="block text-sm font-semibold text-ink-soft">{done ? 'Done · practise again' : 'Learn → Together → Your turn'}</span>
              </span>
              {done && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-good text-white" aria-label="Complete">
                  <Check size={20} strokeWidth={3.5} />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {saveFailed && (
        <p role="status" className="mt-4 text-center font-semibold text-ink-soft">
          This browser couldn’t save progress, so it will last for this visit only.
        </p>
      )}
    </div>
  );
}

function LessonPlayer({ lesson, subject, number, total, done, isLast, onComplete, onAllLessons, onNext }: {
  lesson: GuidedLesson; subject: GuidedSubject; number: number; total: number; done: boolean; isLast: boolean;
  onComplete: (l: GuidedLesson) => void; onAllLessons: () => void; onNext: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [active, setActive] = useState(-1);
  const correct = answer === lesson.answer;
  const phoneme = subject === 'phonics' && !lesson.blend ? PHONEME_BY_GRAPHEME[lesson.focus] : undefined;
  const text = step === 0 ? lesson.teach : lesson.together;

  // Read each teaching step aloud when it appears.
  useEffect(() => {
    if (step < 2) void speak(step === 0 ? lesson.teach : lesson.together, { rate: 0.85 });
    else void speak(`${lesson.question} ${lesson.options.join('. ')}`, { rate: 0.85 });
  }, [step, lesson]);

  const goStep = (n: number) => { stopSpeaking(); setStep(n); setActive(-1); };

  const tapSound = (unit: string, idx: number) => {
    sfx.tap();
    setActive(idx);
    void playPhoneme(unit, sayUnit(unit)).then(() => setActive(-1));
  };

  const blend = async () => {
    if (!lesson.blend) return;
    await speakSequence([
      ...lesson.blend.map((u, idx) => ({ text: sayUnit(u), rate: 0.55, pitch: 1, pause: 160, onStart: () => setActive(idx) })),
      { text: lesson.example, rate: 0.75, onStart: () => setActive(-1) },
    ]);
  };

  const choose = (option: string) => {
    if (correct) return;
    setAnswer(option);
    if (option === lesson.answer) {
      sfx.correct();
      burst();
      onComplete(lesson);
      void speak('You did it! Lesson complete.');
    } else {
      sfx.wrong();
      void speak(`Let’s try together. ${lesson.hint}`, { rate: 0.85 });
    }
  };

  // Anything longer than a short word reads better stacked on a phone; sentences always stack.
  const longest = Math.max(...lesson.options.map(o => o.length));
  const optionGrid = longest > 12 ? 'grid-cols-1' : longest > 4 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-3';

  return (
    <div className={`mx-auto w-full max-w-2xl ${correct ? 'pb-48 sm:pb-36' : 'pb-10'}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <button type="button" onClick={onAllLessons}
          className="chunky-sm flex items-center gap-1.5 rounded-2xl bg-paper px-3.5 py-2 font-bold">
          <ChevronLeft size={20} strokeWidth={2.5} /> All lessons
        </button>
        <span className="text-sm font-black text-ink-soft">Lesson {number} of {total}{done ? ' · ✓ done' : ''}</span>
      </div>
      <h2 className="mb-4 text-3xl font-black leading-tight">{lesson.title}</h2>

      {/* step tracker */}
      <ol aria-label="Lesson steps" className="chunky-sm mb-5 grid grid-cols-3 gap-1 rounded-full bg-paper p-1">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={step === i ? 'step' : undefined}>
            <button
              type="button"
              onClick={() => goStep(i)}
              className={`w-full rounded-full px-2 py-2 text-sm font-black transition-colors sm:text-base
                ${step === i ? 'bg-accent text-white' : i < step ? 'bg-accent-soft text-accent-deep' : 'text-ink-soft'}`}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="chunky mb-5 overflow-hidden rounded-[2rem] bg-paper text-center">
        <div className="flex items-center justify-center gap-4 bg-accent-soft px-4 py-5">
          <span className="text-7xl leading-none" aria-hidden>{lesson.visual}</span>
          <span className={`font-black text-accent-deep ${lesson.focus.length > 8 ? 'text-3xl sm:text-4xl' : 'text-6xl sm:text-7xl'}`}>{lesson.focus}</span>
        </div>

        {step < 2 ? (
          <div className="border-t-[3px] border-ink p-5 text-left sm:p-7">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-black text-accent-deep">
              <BookOpen size={20} /> {step === 0 ? 'Let me teach you' : 'Let’s do it together'}
            </h2>
            <p className="mb-5 text-xl font-semibold leading-relaxed">{text}</p>

            {step === 1 && lesson.blend && (
              <div className="mb-5 text-center">
                <p className="mb-3 font-bold text-ink-soft">Tap each letter as you say its sound together.</p>
                <div className="mb-4 flex justify-center gap-3">
                  {lesson.blend.map((u, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      animate={{ y: active === idx ? -10 : 0 }}
                      aria-label={`Sound ${idx + 1}: ${u}`}
                      onClick={() => tapSound(u, idx)}
                      className={`chunky h-20 w-20 rounded-3xl text-5xl font-black ${active === idx ? 'bg-sun text-ink' : 'bg-accent text-white'}`}
                    >{u}</motion.button>
                  ))}
                </div>
                <Button variant="good" onClick={() => void blend()}>🐇 Blend it</Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={() => void speak(text, { rate: 0.85 })}
                className="chunky-sm inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 font-bold">
                <Volume2 size={18} /> Read it to me
              </button>
              {phoneme && (
                <button type="button" onClick={() => void playPhoneme(phoneme.id, phoneme.say)}
                  className="chunky-sm inline-flex items-center gap-2 rounded-full bg-sun px-4 py-2.5 font-bold">
                  👂 Hear the sound {phoneme.ipa}
                </button>
              )}
              <button type="button" onClick={() => void speak(lesson.example, { rate: 0.8 })}
                className="chunky-sm inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2.5 font-bold">
                🗣️ Hear {subject === 'phonics' ? 'the word' : 'an example'}
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t-[3px] border-ink p-5 sm:p-7">
            <div className="mb-5 text-left">
              <MascotSays size="sm" onSpeak={() => void speak(`${lesson.question} ${lesson.options.join('. ')}`, { rate: 0.85 })}>
                {lesson.question}
              </MascotSays>
            </div>
            <div className={`grid gap-3 ${optionGrid}`}>
              {lesson.options.map(option => {
                const picked = answer === option;
                const right = picked && correct;
                return (
                  <motion.button
                    key={option}
                    data-option={option}
                    type="button"
                    disabled={correct && !right}
                    aria-pressed={picked}
                    animate={picked && !correct ? { x: [0, -8, 8, -6, 6, 0] } : right ? { scale: [1, 1.06, 1] } : {}}
                    onClick={() => choose(option)}
                    className={`chunky min-h-16 rounded-3xl p-3 text-2xl font-black sm:min-h-20
                      ${right ? 'bg-good-soft' : picked ? 'bg-oops-soft' : correct ? 'bg-paper opacity-40' : 'bg-paper hover:bg-accent-soft'}`}
                  >{option}</motion.button>
                );
              })}
            </div>
            {answer && !correct && (
              <p role="status" className="chunky-sm mt-5 rounded-2xl bg-oops-soft p-3 text-left text-lg font-semibold">
                💡 Let’s try together. {lesson.hint}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between gap-3">
        {step > 0 ? <Button variant="paper" onClick={() => goStep(step - 1)}>Back a step</Button> : <span />}
        {step < 2 && (
          <Button onClick={() => goStep(step + 1)}>
            {step === 0 ? 'Practise together' : 'I’m ready to try'} <ChevronRight className="inline" size={22} strokeWidth={3} />
          </Button>
        )}
      </div>

      <FeedbackSheet
        show={correct}
        tone="good"
        title="You did it! Lesson complete."
        action={<Button size="lg" variant="good" className="sm:w-60" onClick={onNext}>{isLast ? 'Finish 🎉' : 'Next lesson ➜'}</Button>}
      >
        You can practise again any time.
      </FeedbackSheet>
    </div>
  );
}

export const guidedModes: ModeDef[] = [
  {
    id: 'english', title: 'English Together', emoji: '💬', desc: 'Greetings, naming words, actions, first sentences',
    render: p => <GuidedCourse subject="english" user={p.user} onResult={p.onResult} />,
  },
  {
    id: 'phonics', title: 'Phonics Together', emoji: '🔤', desc: 's, a, t, p, i, n, then blend sat, pin and tap',
    render: p => <GuidedCourse subject="phonics" user={p.user} onResult={p.onResult} />,
  },
];

