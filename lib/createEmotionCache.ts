// lib/createEmotionCache.ts

import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// Crea un cache Emotion per il lato client
// Prepends garantisce che gli stili MUI vengano caricati prima
export default function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]',
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ 
    key: 'mui-style', 
    insertionPoint,
    prepend: true 
  });
}