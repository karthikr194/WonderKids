export function pickVoice<T extends { lang: string; localService: boolean }>(voices: T[], locale: string, offline: boolean) {
  const normalize = (value: string) => value.toLowerCase().replace('_', '-');
  const exact = normalize(locale);
  const base = exact.split('-')[0];
  const suitable = voices.filter(voice => (!offline || voice.localService) && normalize(voice.lang).split('-')[0] === base);
  return suitable.find(voice => normalize(voice.lang) === exact) ?? suitable[0];
}

export const mayUseDeviceSpeech = (kind: 'name' | 'sound' | 'word' | 'sentence') => kind !== 'sound';
