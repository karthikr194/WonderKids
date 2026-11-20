import { useEffect, useState } from 'react';
import { stopSpeaking } from '../lib/speech';

type Language = 'en' | 'hi' | 'ta';
type Card = { letter: string; word: string; picture: string; hint: string };
const courses: Record<Language, { title: string; locale: string; cards: Card[] }> = {
  en: { title: 'English ABC & Sounds', locale: 'en-IN', cards: [
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => ({ letter, word: ['Apple','Ball','Cat','Dog','Elephant','Fish','Grapes','Hat','Ice cream','Jug','Kite','Lion','Mango','Nest','Orange','Parrot','Queen','Rabbit','Sun','Tiger','Umbrella','Van','Watch','Xylophone','Yak','Zebra'][i], picture: ['🍎','⚽','🐱','🐶','🐘','🐟','🍇','🎩','🍦','🏺','🪁','🦁','🥭','🪺','🍊','🦜','👑','🐰','☀️','🐯','☂️','🚐','⌚','🎼','🐂','🦓'][i], hint: letter.toLowerCase() }))
  ]},
  hi: { title: 'हिन्दी स्वर और व्यंजन', locale: 'hi-IN', cards: [
    ...'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं अः'.split(' ').map((letter,i)=>({letter,word:['अनार','आम','इमली','ईख','उल्लू','ऊन','ऋषि','एड़ी','ऐनक','ओखली','औरत','अंगूर','दुःख'][i],picture:['🍎','🥭','🌿','🎋','🦉','🧶','🧘','🦶','👓','🥣','👩','🍇','📖'][i],hint:letter})),
    ...'क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह क्ष त्र ज्ञ'.split(' ').map((letter,i)=>({letter,word:['कमल','खरगोश','गमला','घर','अंग','चम्मच','छाता','जहाज','झंडा','ज्ञान','टमाटर','ठेला','डमरू','ढोल','बाण','तरबूज','थाली','दरवाजा','धनुष','नल','पतंग','फल','बकरी','भालू','मछली','योग','रस','लड्डू','वन','शेर','षट्कोण','सूरज','हाथी','क्षमा','त्रिशूल','ज्ञानी'][i],picture:['🪷','🐰','🪴','🏠','👆','🥄','☂️','✈️','🚩','📚','🍅','🛒','🥁','🥁','🏹','🍉','🍽️','🚪','🏹','🚰','🪁','🍎','🐐','🐻','🐟','🧘','🧃','🍬','🌳','🦁','⬡','☀️','🐘','🙏','🔱','📚'][i],hint:letter}))
  ]},
  ta: { title: 'தமிழ் எழுத்துக்கள்', locale: 'ta-IN', cards: [
    ...'அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ ஃ'.split(' ').map((letter,i)=>({letter,word:['அணில்','ஆடு','இலை','ஈ','உரல்','ஊஞ்சல்','எலி','ஏணி','ஐந்து','ஒட்டகம்','ஓநாய்','ஔவையார்','ஆய்தம்'][i],picture:['🐿️','🐐','🍃','🪰','🥣','🛝','🐭','🪜','🖐️','🐪','🐺','👵','🔤'][i],hint:letter})),
    ...'க் ங் ச் ஞ் ட் ண் த் ந் ப் ம் ய் ர் ல் வ் ழ் ள் ற் ன்'.split(' ').map(letter=>({letter,word:letter,picture:'🔤',hint:letter}))
  ]}
};
function say(text: string, lang: Language) {
  if (!('speechSynthesis' in window)) return;
  stopSpeaking();
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = courses[lang].locale;
  utterance.rate = 0.72;
  const voice = synth.getVoices().find(v=>v.lang.toLowerCase().startsWith(lang === 'en' ? 'en' : lang));
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
}
export function LanguageCourse({ onBack }: { onBack: () => void }) {
  const [lang,setLang] = useState<Language>('en');
  const [index,setIndex] = useState(0);
  const [quiz,setQuiz] = useState(false);
  const [choice,setChoice] = useState('');
  const [stars,setStars] = useState(0);
  const cards = courses[lang].cards;
  const card = cards[index];
  useEffect(()=>()=>window.speechSynthesis?.cancel(),[]);
  const changeLang=(next:Language)=>{window.speechSynthesis?.cancel();setLang(next);setIndex(0);setQuiz(false);setChoice('');};
  const next=()=>{setIndex(i=>(i+1)%cards.length);setQuiz(false);setChoice('');};
  const options=[card, cards[(index+3)%cards.length], cards[(index+7)%cards.length]].sort((a,b)=>a.letter.localeCompare(b.letter));
  return <main className="mx-auto max-w-2xl p-4 pb-12">
    <button className="mb-4 rounded-xl bg-white px-4 py-3 font-bold" onClick={onBack}>← Back to courses</button>
    <h1 className="mb-3 text-center text-3xl font-black">🌈 Learn with Pictures</h1>
    <div className="mb-5 grid grid-cols-3 gap-2">{(['en','hi','ta'] as Language[]).map(l=><button key={l} aria-pressed={lang===l} onClick={()=>changeLang(l)} className={`rounded-2xl border-2 border-black p-3 font-black ${lang===l?'bg-yellow-300':'bg-white'}`}>{({en:'English',hi:'हिन्दी',ta:'தமிழ்'} as const)[l]}</button>)}</div>
    <p className="mb-2 text-center font-bold">{courses[lang].title} · {index+1}/{cards.length} · ⭐ {stars}</p>
    <div className="rounded-[2rem] border-4 border-black bg-white p-6 text-center shadow-lg">
      <div className="text-8xl font-black text-blue-600" lang={lang}>{card.letter}</div>
      <div role="img" aria-label={card.word} className="my-5 text-8xl">{card.picture}</div>
      <div className="text-3xl font-black" lang={lang}>{card.word}</div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button className="rounded-2xl bg-blue-600 p-4 font-bold text-white" onClick={()=>say(card.letter,lang)}>🔊 Letter sound</button>
        <button className="rounded-2xl bg-emerald-600 p-4 font-bold text-white" onClick={()=>say(card.word,lang)}>🔊 Say word</button>
      </div>
      <button className="mt-3 w-full rounded-2xl bg-amber-200 p-4 font-bold" onClick={()=>say(card.letter+' '+card.word,lang)}>👂 Listen and repeat</button>
    </div>
    {quiz ? <section className="mt-5 rounded-2xl bg-white p-4 text-center">
      <h2 className="mb-3 text-xl font-black">Find the letter for {card.word}!</h2>
      <div className="grid grid-cols-3 gap-2">{options.map(o=><button key={o.letter} disabled={!!choice} onClick={()=>{setChoice(o.letter);if(o.letter===card.letter)setStars(s=>s+1);}} className="rounded-xl border-2 p-4 text-3xl font-bold">{o.letter}</button>)}</div>
      {choice&&<p role="status" className="mt-3 font-bold">{choice===card.letter?'🌟 Great job!':'Try the next one! Correct: '+card.letter}</p>}
      {choice&&<button className="mt-3 rounded-xl bg-blue-600 p-3 font-bold text-white" onClick={next}>Next →</button>}
    </section>:<div className="mt-5 grid grid-cols-2 gap-3"><button className="rounded-xl bg-yellow-300 p-4 font-bold" onClick={()=>setQuiz(true)}>🎮 Play quiz</button><button className="rounded-xl bg-blue-600 p-4 font-bold text-white" onClick={next}>Next letter →</button></div>}
    <p className="mt-4 text-center text-sm">Speech depends on installed device voices. Native recordings are recommended for accurate phonics.</p>
  </main>;
}
