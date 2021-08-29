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
    case 'zh':
    case 'cn':
      return 'Chinese';
    case 'ko':
      return 'Korean';
    case 'pl':
      return 'Polish';
    case 'ar':
      return 'Arabic';
    case 'xx':
      return '-';
    case 'en':
      return 'English';
    default:
      console.log('Unknown language code', language);
      return 'Unknown';
  }
};

export const emojiForLanguage = (language) => {
  switch (language) {
    case 'Czech':
      return '\uD83C\uDDE8\uD83C\uDDFF';
    case 'German':
      return '\uD83C\uDDE9\uD83C\uDDEA';
    case 'Spanish':
      return '\uD83C\uDDEA\uD83C\uDDF8';
    case 'Farsi':
      return '\uD83C\uDDEE\uD83C\uDDF7';
    case 'French':
      return '\uD83C\uDDEB\uD83C\uDDF7';
    case 'Italian':
      return '\uD83C\uDDEE\uD83C\uDDF9';
    case 'Japanese':
      return '\uD83C\uDDEF\uD83C\uDDF5';
    case 'Korean':
      return '\uD83C\uDDF0\uD83C\uDDF7';
    case 'Polish':
      return '\uD83C\uDDF5\uD83C\uDDF1';
    case 'Chinese':
      return '\uD83C\uDDE8\uD83C\uDDF3';
    case 'Arabic':
      return '';
    case '-':
      return '';
    case 'English':
      return '\uD83C\uDDFA\uD83C\uDDF8';
    default:
      return '';
  }
};
