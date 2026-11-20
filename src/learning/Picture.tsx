import { useState } from 'react';
import { BookOpen } from 'lucide-react';

export function Picture({ asset, label, large = false }: { asset?: string; label: string; large?: boolean }) {
  const [failed, setFailed] = useState<string>();
  if (!asset || failed === asset) return <span className="wk-picture-fallback" role={label ? 'img' : undefined}
    aria-label={label || undefined} aria-hidden={label ? undefined : true}><BookOpen size={36} /></span>;
  const base = `/learning/pictures/${asset}`;
  return <img className="wk-picture" src={`${base}-128.webp`}
    srcSet={`${base}-128.webp 128w, ${base}-208.webp 208w`}
    sizes={large ? '208px' : '128px'} width={large ? 208 : 128} height={large ? 208 : 128}
    alt={label} decoding="async" onError={() => setFailed(asset)} />;
}
