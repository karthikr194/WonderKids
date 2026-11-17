import { Quiz, type QuizQuestion } from '../components/engines/Quiz';
import { BigEmoji, OptionText, ShapeSvg, Swatch } from '../components/ui/Visuals';
import { speak } from '../lib/speech';
import { pick, shuffle } from '../lib/random';
import { COLORS, COLOR_MIXES, SHAPES, colorByName, sidesWord } from '../data/shapesColors';
import type { Level, ModeDef } from '../types';

const swatchOption = (name: string) => ({
  id: name, visual: <Swatch hex={colorByName(name).hex} />, speak: name,
});

function makeColor(level: Level): QuizQuestion {
  const c = pick(COLORS);
  const others = (n: number) => shuffle(COLORS.filter(x => x.name !== c.name)).slice(0, n);

  if (level === 1) {
    return {
      key: `name-${c.name}`,
      prompt: 'What colour is this?',
      audio: () => speak('What colour is this?'),
      visual: <Swatch hex={c.hex} size="h-32 w-32" />,
      options: shuffle([c, ...others(2)]).map(x => ({ id: x.name, label: x.name })),
      correctId: c.name,
      optionStyle: 'chip',
      explain: `This is ${c.name}.`,
    };
  }
  if (level === 2 || Math.random() < 0.4) {
    const thing = pick(c.things);
    return {
      key: `thing-${thing.name}`,
      prompt: `What colour is a ${thing.name}?`,
      visual: <BigEmoji>{thing.emoji}</BigEmoji>,
      options: shuffle([c, ...others(3)]).map(x => swatchOption(x.name)),
      correctId: c.name,
      optionStyle: 'big',
      explain: `A ${thing.name} is ${c.name.toLowerCase()}.`,
    };
  }
  const mix = pick(COLOR_MIXES);
  return {
    key: `mix-${mix.a}-${mix.b}`,
    prompt: `${mix.a} + ${mix.b} = ?`,
    audio: () => speak(`What colour do you get when you mix ${mix.a} and ${mix.b}?`),
    visual: (
      <div className="flex items-center gap-3 text-4xl font-black text-ink-soft">
        <Swatch hex={colorByName(mix.a).hex} size="h-16 w-16" /> + <Swatch hex={colorByName(mix.b).hex} size="h-16 w-16" /> = ❓
      </div>
    ),
    options: shuffle([mix.result, ...shuffle(COLORS.map(c => c.name).filter(n => n !== mix.result && n !== mix.a && n !== mix.b)).slice(0, 3)]).map(swatchOption),
    correctId: mix.result,
    optionStyle: 'big',
    explain: `${mix.a} and ${mix.b} make ${mix.result.toLowerCase()}.`,
  };
}

function makeShape(level: Level): QuizQuestion {
  const kind = level === 1 ? 'name' : pick(level === 2 ? ['name', 'find', 'sides'] : ['find', 'sides', 'sides']);
  const s = pick(SHAPES);

  if (kind === 'name') {
    return {
      key: `name-${s.name}`,
      prompt: 'What shape is this?',
      audio: () => speak('What shape is this?'),
      visual: <ShapeSvg shape={s} size={150} />,
      options: shuffle([s, ...shuffle(SHAPES.filter(x => x !== s)).slice(0, level === 1 ? 2 : 3)]).map(x => ({ id: x.name, label: x.name })),
      correctId: s.name,
      optionStyle: 'chip',
      explain: `This is a ${s.name.toLowerCase()}. It has ${sidesWord(s.sides)}.`,
    };
  }
  if (kind === 'find') {
    return {
      key: `find-${s.name}`,
      prompt: `Find the ${s.name}!`,
      options: shuffle([s, ...shuffle(SHAPES.filter(x => x !== s)).slice(0, 3)]).map(x => ({ id: x.name, visual: <ShapeSvg shape={x} size={84} />, speak: x.name })),
      correctId: s.name,
      optionStyle: 'big',
      explain: `That is the ${s.name.toLowerCase()}.`,
    };
  }
  const polygon = pick(SHAPES.filter(x => x.sides >= 3 && x.sides !== 10));
  const answers = [...new Set(SHAPES.filter(x => x.sides !== 10).map(x => x.sides))];
  return {
    key: `sides-${polygon.name}`,
    prompt: 'How many sides does it have?',
    visual: <ShapeSvg shape={polygon} size={150} />,
    options: shuffle([polygon.sides, ...shuffle(answers.filter(n => n !== polygon.sides && n > 0)).slice(0, 3)]).map(n => ({ id: String(n), visual: <OptionText>{n}</OptionText>, speak: String(n) })),
    correctId: String(polygon.sides),
    optionStyle: 'big',
    explain: `A ${polygon.name.toLowerCase()} has ${polygon.sides} sides.`,
  };
}

export const shapesColorsModes: ModeDef[] = [
  {
    id: 'colors', title: 'Colours', emoji: '🎨', desc: 'Names, objects and colour mixing',
    render: p => <Quiz makeQuestion={makeColor} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'shapes', title: 'Shapes', emoji: '🔷', desc: 'Name shapes and count their sides',
    render: p => <Quiz makeQuestion={makeShape} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
];
