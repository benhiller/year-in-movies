export const labelForLanguage = (language) => {
  switch (language) {
    case 'cs':
      return 'Czech';
    case 'de':
      return 'German';
    case 'es':
      return 'Spanish';
    case 'fa':
      return 'Farsi';
    case 'fr':
      return 'French';
    case 'it':
      return 'Italian';
    case 'ja':
      return 'Japanese';
    case 'ko':
      return 'Korean';
    case 'pl':
      return 'Polish';
    case 'en':
    default:
      return 'English';
  }
};

export const emojiForLanguage = (language) => {
  switch (language) {
    case 'cs':
      return '\uD83C\uDDE8\uD83C\uDDFF';
    case 'de':
      return '\uD83C\uDDE9\uD83C\uDDEA';
    case 'es':
      return '\uD83C\uDDEA\uD83C\uDDF8';
    case 'fa':
      return '\uD83C\uDDEE\uD83C\uDDF7';
    case 'fr':
      return '\uD83C\uDDEB\uD83C\uDDF7';
    case 'it':
      return '\uD83C\uDDEE\uD83C\uDDF9';
    case 'ja':
      return '\uD83C\uDDEF\uD83C\uDDF5';
    case 'ko':
      return '\uD83C\uDDF0\uD83C\uDDF7';
    case 'pl':
      return '\uD83C\uDDF5\uD83C\uDDF1';
    case 'en':
    default:
      return '\uD83C\uDDFA\uD83C\uDDF8';
  }
};
