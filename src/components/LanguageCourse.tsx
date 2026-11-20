import { useState } from 'react';
import { ArrowLeft, Star, Volume2, VolumeX } from 'lucide-react';
import { courses, languageInfo, languages, type Language, type Lesson } from '../learning/curriculum';
import { emptyCourse, localDate, nextLesson, recordAttempt, type LearningProgress } from '../learning/progress';
import { LessonPlayer } from '../learning/LessonPlayer';
import { Picture } from '../learning/Picture';
import { stopSpeaking } from '../lib/speech';
import '../learning/learning.css';

interface Props {
  initial: Language | 'parent';
  progress: LearningProgress;
  update: (action: (current: LearningProgress) => LearningProgress) => void;
  onBack: () => void;
  onToggleSound: () => void;
  soundOn: boolean;
}

function ParentDashboard({ progress }: { progress: LearningProgress }) {
  return <section className="wk-dashboard">
    <h1>Parent dashboard</h1>
    {languages.map(language => {
      const stats = progress[language] ?? emptyCourse();
      const results = Object.values(stats.lessons);
      const attempts = results.reduce((total, result) => total + result.attempts, 0);
      const correct = results.reduce((total, result) => total + result.correct, 0);
      const difficult = courses[language].filter(lesson => {
        const practice = stats.lessons[lesson.id];
        return practice && practice.attempts - practice.correct >= 2;
      }).slice(0, 6);
      return <article key={language} className="wk-panel">
        <h2 lang={language}>{languageInfo[language].title}</h2>
        <p>{results.filter(result => result.mastered).length} / {courses[language].length} completed · {stats.stars} stars · {stats.xp} XP</p>
        <p>{attempts ? `${Math.round(100 * correct / attempts)}% practice accuracy` : 'No practice yet'} · {stats.streak} day streak</p>
        {stats.lastPracticed && <p>Last practiced {stats.lastPracticed}</p>}
        {difficult.length > 0 && <p>Practice again <span lang={language}>{difficult.map(lesson => lesson.letter).join(' · ')}</span></p>}
      </article>;
    })}
  </section>;
}

export function LanguageCourse({ initial, progress, update, onBack, onToggleSound, soundOn }: Props) {
  const [language, setLanguage] = useState<Language>(initial === 'parent' ? 'en' : initial);
  const [lesson, setLesson] = useState<Lesson>();
  const stats = progress[language] ?? emptyCourse();
  const available = courses[language];
  const [groupChoice, setGroupChoice] = useState<string>();
  const current = available.find(item => item.id === stats.current);
  const resume = current && stats.lessons[current.id]?.mastered ? nextLesson(current) ?? current : current ?? available[0];
  const group = groupChoice ?? resume.group;
  const open = (item?: Lesson) => {
    stopSpeaking();
    setLesson(item);
    if (item) {
      setGroupChoice(item.group);
      update(prior => ({ ...prior, [language]: { ...(prior[language] ?? emptyCourse()), current: item.id } }));
    }
  };
  return <main className="wk-shell">
    <header className="wk-top">
      <button className="wk-button" onClick={() => { stopSpeaking(); if (lesson) open(); else onBack(); }}><ArrowLeft size={18} /> {lesson ? 'Course' : 'Home'}</button>
      <button className="wk-button" aria-label={soundOn ? 'Mute sound' : 'Turn sound on'} aria-pressed={!soundOn} onClick={onToggleSound}>
        {soundOn ? <Volume2 size={21} /> : <VolumeX size={21} />}
      </button>
    </header>
    {initial === 'parent' ? <ParentDashboard progress={progress} /> : <>
      <nav className="wk-options" aria-label="Languages">
        {languages.map(item => <button className="wk-button" key={item} lang={item} aria-pressed={language === item}
          onClick={() => { open(); setGroupChoice(undefined); setLanguage(item); }}>{languageInfo[item].title}</button>)}
      </nav>
      <header className="wk-heading">
        <h1 lang={language}>{languageInfo[language].title}</h1>
        <span><Star size={18} fill="#f6bf54" /> {stats.stars}</span>
      </header>
      {lesson ? <LessonPlayer key={lesson.id} lesson={lesson} soundOn={soundOn} mastered={Boolean(stats.lessons[lesson.id]?.mastered)}
        onAttempt={(correct, complete) => update(prior => ({
          ...prior, [language]: recordAttempt(prior[language] ?? emptyCourse(), lesson, correct, complete, localDate()),
        }))} onNext={() => open(nextLesson(lesson))} /> : <>
        <div className="wk-panel wk-course-banner" style={{ background: languageInfo[language].color }}>
          <div><h2>Continue learning</h2><p lang={language}>{resume.group}</p>
          <button className="wk-button wk-primary" onClick={() => open(resume)}>Start lesson</button></div>
          <Picture asset={languageInfo[language].art} label="" />
        </div>
        <label className="wk-unit">Choose a unit
          <select value={group} onChange={event => setGroupChoice(event.target.value)}>
            {[...new Set(available.map(item => item.group))].map(item => <option key={item} lang={language}>{item}</option>)}
          </select>
        </label>
        <div className="wk-lessons">{available.filter(item => item.group === group).map(item =>
          <button className="wk-answer" key={item.id} lang={language} onClick={() => open(item)}>
            <strong>{item.letter}</strong>
            {stats.lessons[item.id]?.mastered && <span aria-label="Completed">✓</span>}
          </button>)}</div>
      </>}
    </>}
  </main>;
}
