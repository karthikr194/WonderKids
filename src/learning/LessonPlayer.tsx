import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Volume2 } from 'lucide-react';
import { NumberVisual } from '../components/ui/Visuals';
import { MascotAvatar } from '../components/ui/Mascot';
import { stopSpeaking } from '../lib/speech';
import { Picture } from './Picture';
import { BuildWord, LetterTracing } from './Practice';
import { lessonOptions, type Lesson } from './curriculum';
import { playTeachingAudio, type AudioKind, type Playback } from './audio';

const steps = ['Meet', 'Sound', 'Picture', 'Repeat', 'Find', 'Practice', 'Reward'];
const encouragement = { en: 'Great work!', hi: 'बहुत बढ़िया!', ta: 'மிக நன்று!' };
const instructions = { en: 'Choose the matching card.', hi: 'सही कार्ड चुनो।', ta: 'சரியான அட்டையைத் தேர்ந்தெடு.' };

export function LessonPlayer({ lesson, soundOn, onAttempt, onNext, mastered }: {
  lesson: Lesson;
  soundOn: boolean;
  mastered: boolean;
  onAttempt: (correct: boolean, complete: boolean) => void;
  onNext: () => void;
}) {
  const [step, setStep] = useState(0);
  const [slow, setSlow] = useState(false);
  const [playback, setPlayback] = useState<Playback>('idle');
  const [feedback, setFeedback] = useState('');
  const [found, setFound] = useState(false);
  const [earned, setEarned] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => () => stopSpeaking(), []);
  const play = (kind: AudioKind, text?: string) => playTeachingAudio(lesson, kind, slow, setPlayback, text);
  const advance = () => {
    stopSpeaking();
    setPlayback('idle');
    setFeedback('');
    setStep(step + 1);
  };
  const complete = () => {
    setEarned(!mastered);
    onAttempt(true, true);
    advance();
    play('sentence', encouragement[lesson.language]);
  };
  const pictureQuiz = Boolean(lesson.picture && step === 4);
  const missingLetter = lesson.id.startsWith('en-cvc-') && step === 4;
  const missingChoices = [...new Set([lesson.word[1], 'a', 'e', 'i', 'o', 'u'])].slice(0, 3).sort();
  const quizChoices = step === 4 ? lessonOptions(lesson, pictureQuiz) : [];
  const choose = (correct: boolean) => {
    if (found) return;
    onAttempt(correct, false);
    setFound(correct);
    setFeedback(correct ? 'You found it!' : 'Take another look and try again.');
  };
  const trace = !lesson.tiles && Array.from(lesson.letter).length <= 3;
  return <article className="wk-lesson">
    <div className="wk-steps" aria-label={`Step ${step + 1} of ${steps.length}`}>
      {steps.map((name, index) => <span key={name} aria-current={step === index ? 'step' : undefined}>{name}</span>)}
    </div>
    <motion.div className="wk-stage" key={step} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      {step < 4 && <>
        {step === 0 && <motion.div initial={false} animate={reduceMotion ? {} : { rotate: [0, -6, 5, 0] }} transition={{ duration: 0.65 }}>
          <MascotAvatar size="lg" />
        </motion.div>}
        <h2>{['Meet today’s lesson', 'Listen to the sound', lesson.picture ? 'Look and listen' : 'Read and listen', 'Your turn to say it'][step]}</h2>
        <div className="wk-glyph" lang={lesson.language} data-playing={playback === 'playing'}>{lesson.letter}{lesson.lowercase && <small>{lesson.lowercase}</small>}</div>
        {step >= 2 && <>
          {lesson.picture && <Picture asset={lesson.picture} label={lesson.word} large />}
          {lesson.quantity !== undefined && <NumberVisual n={lesson.quantity} />}
          {lesson.word !== lesson.letter && <p className="wk-word" lang={lesson.language}>{lesson.word}</p>}
          {step === 3 && <p>Listen, then say it out loud.</p>}
        </>}
        {step === 1 && lesson.phoneme && <p className="wk-phoneme">/{lesson.phoneme}/ in <strong>{lesson.word}</strong></p>}
        {step < 2 && lesson.transliteration && <p>{lesson.transliteration}</p>}
        {step === 1 && lesson.combination && <p className="wk-combination" lang={lesson.language}>{lesson.combination}</p>}
        {step === 1 && lesson.tiles && <p className="wk-combination" lang={lesson.language}>{lesson.tiles.join(' + ')} → {lesson.word}</p>}
        <button className="wk-button" disabled={!soundOn}
          onClick={() => play((['name', lesson.phoneme || (lesson.language !== 'en' && lesson.quantity === undefined && !lesson.id.includes('-vocabulary-') && lesson.difficulty < 3) ? 'sound' : 'word', 'word', 'sentence'] as const)[step])}>
          <Volume2 size={19} /> {['Letter or word name', 'Play sound', 'Say word', 'Listen and repeat'][step]}
        </button>
        {step === 1 && (lesson.language !== 'en' || lesson.phoneme) && <button className="wk-button" disabled={!soundOn} onClick={() => play('word')}>Hear example</button>}
      </>}
      {step === 4 && <>
        <h2>{missingLetter ? 'Find the missing vowel' : pictureQuiz ? 'Find the picture' : 'Find the matching card'}</h2>
        <p className="wk-word" lang={lesson.language}>{missingLetter ? `${lesson.word[0]} _ ${lesson.word.slice(2)}` : pictureQuiz ? lesson.word : lesson.letter}</p>
        <button className="wk-button" disabled={!soundOn} onClick={() => play('sentence', instructions[lesson.language])}><Volume2 size={19} /> Instructions</button>
        <button className="wk-button" disabled={!soundOn} onClick={() => play('word')}><Volume2 size={19} /> Listen to the word</button>
        <div className="wk-options">{missingLetter ? missingChoices.map(choice => <button key={choice} className="wk-answer"
          disabled={found} onClick={() => choose(choice === lesson.word[1])}>{choice}</button>) : quizChoices.map(option => <button key={option.id}
          className="wk-answer" disabled={found} onClick={() => choose(option.id === lesson.id)} lang={option.language}>
          {pictureQuiz ? <Picture asset={option.picture} label={option.word} /> : option.letter}
        </button>)}</div>
        <p role="status">{feedback}</p>
      </>}
      {step === 5 && <>
        <h2>{lesson.tiles ? 'Build it' : trace ? 'Trace it' : 'Read it aloud'}</h2>
        {lesson.tiles ? <BuildWord lesson={lesson} onResult={correct => {
          if (correct) complete();
          else onAttempt(false, false);
        }} /> : <>
          {trace ? <LetterTracing lesson={lesson} /> : <p className="wk-word" lang={lesson.language}>{lesson.word}</p>}
          <button className="wk-button wk-primary" onClick={complete}>Finish practice</button>
        </>}
      </>}
      {step === 6 && <>
        <motion.div initial={reduceMotion ? false : { scale: 0.6 }} animate={{ scale: 1 }} className="wk-star"><Star size={68} fill="currentColor" /></motion.div>
        <h2>Lesson complete!</h2>
        <p>{earned ? 'You earned 1 star and 10 XP.' : 'You practiced this lesson again.'}</p>
        <button className="wk-button wk-primary" onClick={onNext}>Next lesson <ArrowRight size={18} /></button>
        <button className="wk-button" disabled={!soundOn} onClick={() => play('sentence', encouragement[lesson.language])}><Sparkles size={18} /> Hear it again</button>
      </>}
      <div className="wk-controls">
        {step < 5 && <button className="wk-button" aria-pressed={slow} onClick={() => setSlow(!slow)}>{slow ? 'Slow speed on' : 'Slow speed'}</button>}
        {playback === 'playing' && <button className="wk-button" onClick={stopSpeaking}>Stop audio</button>}
        {playback === 'unavailable' && <p role="status">Audio is unavailable for this clip on this device.</p>}
      </div>
      {(step < 4 || step === 4 && found) &&
        <button className="wk-button wk-primary" onClick={advance}>{step === 3 ? 'Play game' : 'Continue'} <ArrowRight size={18} /></button>}
    </motion.div>
  </article>;
}
