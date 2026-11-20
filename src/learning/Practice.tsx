import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { Lesson } from './curriculum';

export function LetterTracing({ lesson }: { lesson: Lesson }) {
  const drawing = useRef(false);
  const [strokes, setStrokes] = useState<string[]>([]);
  const point = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return `${(event.clientX - rect.left) * 300 / rect.width},${(event.clientY - rect.top) * 150 / rect.height}`;
  };
  return <div>
    <p>Follow the letter with your finger.</p>
    <svg lang={lesson.language} className="wk-tracing" viewBox="0 0 300 150" aria-label={`Trace ${lesson.letter}`}
      onPointerDown={event => {
        event.currentTarget.setPointerCapture(event.pointerId);
        drawing.current = true;
        const position = point(event);
        setStrokes(strokes => [...strokes, `M ${position} L ${position}`]);
      }}
      onPointerMove={event => {
        if (!drawing.current) return;
        const position = point(event);
        setStrokes(strokes => [...strokes.slice(0, -1), `${strokes.at(-1)} L ${position}`]);
      }}
      onLostPointerCapture={() => { drawing.current = false; }}>
      <text x="150" y="108" textAnchor="middle" fontSize="84" fill="#cec9ec">{lesson.lowercase ?? lesson.letter}</text>
      {strokes.map((stroke, index) => <path key={index} d={stroke} stroke="#6d45bd" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />)}
    </svg>
    <button className="wk-button" onClick={() => setStrokes([])}>Clear tracing</button>
  </div>;
}

export function BuildWord({ lesson, onResult }: { lesson: Lesson; onResult: (correct: boolean) => void }) {
  const tiles = lesson.tiles ?? [];
  const order = tiles.map((_, index) => index).reverse();
  const [picked, setPicked] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);
  const choose = (index: number) => {
    if (done || picked.includes(index)) return;
    const next = [...picked, index];
    setPicked(next);
    if (next.length !== tiles.length) return;
    const correct = next.every((value, position) => tiles[value] === tiles[position]);
    setDone(correct);
    setFeedback(correct ? 'You built it!' : 'Try moving the tiles into a different order.');
    onResult(correct);
  };
  return <div>
    <p>Tap the tiles in order.</p>
    <div className="wk-combination wk-drop" aria-live="polite" onDragOver={event => event.preventDefault()}
      onDrop={event => {
        event.preventDefault();
        const value = event.dataTransfer.getData('application/wonderkids-tile');
        const index = Number(value);
        if (value && Number.isInteger(index) && index >= 0 && index < tiles.length) choose(index);
      }}>{picked.map(index => tiles[index]).join(' + ') || '…'} → {done ? lesson.word : '?'}</div>
    <div className="wk-options">{order.map(index => <button key={index} className="wk-button" disabled={done || picked.includes(index)}
      draggable={!done && !picked.includes(index)}
      onDragStart={event => event.dataTransfer.setData('application/wonderkids-tile', String(index))}
      onClick={() => choose(index)}>{tiles[index]}</button>)}</div>
    <p role="status">{feedback}</p>
    {!done && <button className="wk-button" onClick={() => { setPicked([]); setFeedback(''); }}>Reset tiles</button>}
  </div>;
}
