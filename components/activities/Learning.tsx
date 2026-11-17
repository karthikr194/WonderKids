import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, Volume2 } from 'lucide-react';
import { lessons, LearningSubject } from '../../data/lessons';
import { UserProfile } from '../../types';

const steps = ['Learn', 'Together', 'Your turn'];
const button = 'min-h-12 rounded-2xl px-5 py-3 font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700';

export function Learning({ subject, user, onBack }: { subject: LearningSubject; user: UserProfile; onBack: () => void }) {
  const course = lessons[subject];
  const storageKey = `wonderkidz-learning-v1:${encodeURIComponent(user.name.trim().toLowerCase())}:${user.age}:${subject}`;
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(saved) ? saved.filter(id => course.some(lesson => lesson.id === id)) : [];
    } catch { return []; }
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [activeSound, setActiveSound] = useState<number | null>(null);
  const [audioMessage, setAudioMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const speechId = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const lesson = selected === null ? null : course[selected];
  const correct = Boolean(lesson && answer === lesson.answer);
  const audioSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const stop = () => { speechId.current += 1; if (audioSupported) window.speechSynthesis.cancel(); };
  useEffect(() => () => { speechId.current += 1; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  useEffect(() => { heading.current?.focus(); }, [selected, step]);

  const speak = (text: string) => {
    if (!audioSupported) { setAudioMessage('Audio is unavailable here. Read the lesson together with a grown-up.'); return; }
    stop();
    const id = speechId.current;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.8;
    utterance.onerror = () => { if (id === speechId.current) setAudioMessage('Audio could not play. You can still read and practise together.'); };
    setAudioMessage('');
    window.speechSynthesis.speak(utterance);
  };
  const reset = (index: number | null) => { stop(); setSelected(index); setStep(0); setAnswer(null); setActiveSound(null); setAudioMessage(''); };
  const chooseAnswer = (value: string) => {
    if (!lesson || correct) return;
    setAnswer(value);
    if (value === lesson.answer && !completed.includes(lesson.id)) {
      const next = [...completed, lesson.id];
      setCompleted(next);
      try { localStorage.setItem(storageKey, JSON.stringify(next)); }
      catch { setSaveMessage('Progress is available this session, but this browser could not save it.'); }
    }
  };

  return <div className="h-full overflow-y-auto bg-blue-50 text-slate-800">
    <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-16">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button className={`${button} bg-white text-blue-800 flex items-center gap-2`} onClick={() => { if (lesson) reset(null); else { stop(); onBack(); } }}><ArrowLeft size={20} />{lesson ? 'All lessons' : 'Home'}</button>
        <span className="font-semibold text-blue-900">{completed.length} / {course.length} lessons complete</span>
      </header>
      <h1 ref={heading} tabIndex={-1} className="text-3xl sm:text-4xl font-bold mb-3 outline-none">{lesson ? lesson.title : subject === 'phonics' ? 'Phonics with a grown-up' : 'Let’s learn English'}</h1>
      {!lesson ? <>
        <p className="text-lg mb-6">{subject === 'phonics' ? 'Start with six sounds, then slide them together to read your first words.' : 'Small lessons for speaking, naming, moving and reading.'} Learn together, then have a go.</p>
        {subject === 'phonics' && <p className="bg-white border border-blue-200 rounded-2xl p-4 mb-6">Grown-up guide: teach the sound, not just the letter name. Model pure sounds without adding “uh”. Audio reads instructions and whole words; model isolated sounds together.</p>}
        <div className="grid sm:grid-cols-2 gap-4">
          {course.map((item, index) => <button key={item.id} onClick={() => reset(index)} className={`${button} text-left bg-white border-2 border-blue-100 hover:border-blue-500 flex items-center gap-4`}>
            <span aria-hidden="true" className="text-4xl">{item.visual}</span>
            <span className="flex-1"><span className="block text-sm text-slate-600">Lesson {index + 1} · {item.blend ? 'Blending' : subject === 'phonics' ? 'Letter sound' : 'English'}</span><span className="block text-xl">{item.title}</span><span className="block text-sm text-blue-700">{completed.includes(item.id) ? 'Complete · Practise again' : 'Learn → Practise → Try'}</span></span>
            {completed.includes(item.id) && <CheckCircle2 aria-label="Complete" className="text-green-700" />}
          </button>)}
        </div>
      </> : <>
        <ol aria-label="Lesson steps" className="flex gap-2 my-6">{steps.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} className={`flex-1 rounded-xl p-3 text-center font-semibold ${step === index ? 'bg-blue-700 text-white' : 'bg-white text-slate-600'}`}>{index + 1}. {label}</li>)}</ol>
        <section className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-blue-100">
          <div aria-hidden="true" className="text-7xl text-center mb-4">{lesson.visual}</div>
          <p className="text-4xl sm:text-6xl font-bold text-center text-blue-800 mb-6">{lesson.focus}</p>
          {step < 2 ? <>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><BookOpen />{step === 0 ? 'Let me teach you' : 'Let’s do it together'}</h2>
            <p className="text-xl leading-relaxed mb-6">{step === 0 ? lesson.teach : lesson.together}</p>
            {step === 1 && lesson.blend && <div className="mb-6"><p className="mb-3">Tap each letter as you say its sound together.</p><div className="flex gap-3 justify-center">{lesson.blend.map((letter, index) => <button key={index} aria-label={`Sound ${index + 1}: ${letter}`} aria-pressed={activeSound === index} className={`${button} text-4xl border-2 ${activeSound === index ? 'bg-blue-700 text-white border-blue-700' : 'bg-blue-50 border-blue-200'}`} onClick={() => setActiveSound(index)}>{letter}</button>)}</div></div>}
            <div className="flex flex-wrap gap-3"><button className={`${button} bg-blue-100 text-blue-900 flex items-center gap-2`} onClick={() => speak(step === 0 ? lesson.teach : lesson.together)}><Volume2 size={20} />Read instructions</button><button className={`${button} bg-blue-100 text-blue-900`} onClick={() => speak(lesson.example)}>Hear {subject === 'phonics' ? 'the word' : 'an example'}</button></div>
          </> : <>
            <h2 className="text-2xl font-bold mb-4">{lesson.question}</h2>
            <button className={`${button} bg-blue-100 text-blue-900 mb-4`} onClick={() => speak(`${lesson.question} ${lesson.options.join('. ')}`)}>Read question and choices</button>
            <div className="grid gap-3">{lesson.options.map(option => <button key={option} disabled={correct} aria-pressed={answer === option} onClick={() => chooseAnswer(option)} className={`${button} text-xl border-2 text-left ${answer === option ? correct ? 'bg-green-100 border-green-700 text-green-900' : 'bg-amber-50 border-amber-600' : 'bg-white border-slate-300'} disabled:cursor-default`}>{option}</button>)}</div>
            <p role="status" className="text-lg mt-5 min-h-8">{answer && (correct ? 'You did it! Lesson complete. You can practise again any time.' : `Let’s try together. ${lesson.hint}`)}</p>
          </>}
          <p role="status" className="mt-4 text-slate-600">{audioMessage || (!audioSupported ? 'Audio is unavailable here. Read and practise with a grown-up.' : '')}</p>
        </section>
        <div className="flex flex-wrap justify-between gap-3 mt-6">
          {step > 0 ? <button className={`${button} bg-white text-blue-800`} onClick={() => { stop(); setStep(step - 1); }}>Back a step</button> : <span />}
          {step < 2 ? <button className={`${button} bg-blue-700 text-white`} onClick={() => { stop(); setStep(step + 1); }}>{step === 0 ? 'Practise together' : 'I’m ready to try'}</button> : correct && <button className={`${button} bg-blue-700 text-white`} onClick={() => reset(selected! + 1 < course.length ? selected! + 1 : null)}>{selected! + 1 < course.length ? 'Next lesson' : 'Finish learning'}</button>}
        </div>
      </>}
      <p role="status" className="mt-4 text-slate-600">{saveMessage}</p>
    </div>
  </div>;
}
