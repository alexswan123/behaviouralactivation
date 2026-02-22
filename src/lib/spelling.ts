/**
 * Returns region-appropriate spellings based on the browser's locale.
 * en-US → American English; everything else → Commonwealth English.
 */
const isAmericanEnglish =
  typeof navigator !== 'undefined' && /^en-US\b/i.test(navigator.language);

export const spell = {
  programme: 'Program',
  behaviour: isAmericanEnglish ? 'Behavior' : 'Behaviour',
  organise:  isAmericanEnglish ? 'Organize' : 'Organise',
};
