export const allGenres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'TV Movie',
  'Thriller',
  'War',
  'Western',
  'Default',
];

export const emojiForGenre = (genre) => {
  switch (genre) {
    case 'Action':
      return '\uD83E\uDD35\uFE0F'; // man in tux (like james bond)
    case 'Adventure':
      return '\uD83E\uDDF3'; // luggage
    case 'Animation':
      return '\uD83D\uDC2D'; // mouse
    case 'Comedy':
      return '\uD83E\uDD21'; // clown
    case 'Crime':
      return '\uD83D\uDC6E\u200D\u2642\uFE0F'; // police
    case 'Documentary':
      return '\uD83D\uDDDE\uFE0F'; // rolled-up newspaper
    case 'Drama':
      return '\uD83C\uDFAD'; // comedy + tragedy masks
    case 'Family':
      return '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67';
    case 'Fantasy':
      return '\uD83E\uDDD9\u200D\u2642\uFE0F'; // man mage
    case 'History':
      return '\uD83D\uDDFF'; // moyai
    case 'Horror':
      return '\uD83E\uDDDF\u200D\u2642\uFE0F'; // zombie
    case 'Music':
      return '\uD83C\uDFB8'; // guitar
    case 'Mystery':
      return '\uD83D\uDD75\uFE0F';
    case 'Romance':
      return '\uD83D\uDC8B'; // kiss mark
    case 'Science Fiction':
      return '\uD83D\uDC68\u200D\uD83D\uDE80'; // astronaut
    case 'TV Movie':
      return '\uD83D\uDCFA'; // television
    case 'Thriller':
      return '\uD83D\uDD2A'; // knife
    case 'War':
      return '\uD83C\uDF96\uFE0F'; // military medal
    case 'Western':
      return '\uD83E\uDD20'; // cowboy hat face (like indiana jones)
    default:
      return '\uD83C\uDFA6'; // movie camera icon
  }
};
