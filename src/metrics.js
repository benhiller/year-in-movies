export const computeTopDirectors = (movieData) =>
  Object.entries(
    movieData.reduce((acc, movie) => {
      const { director } = movie;
      if (!director) {
        return acc;
      }

      if (acc[director.name]) {
        const { count } = acc[director.name];
        acc[director.name] = { director, count: count + 1 };
      } else {
        acc[director.name] = { director, count: 1 };
      }
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1].count - a[1].count)
    .map(([_, item]) => item);

export const computeTopCastMembers = (movieData) =>
  Object.entries(
    movieData.reduce((acc, movie) => {
      const { cast } = movie;
      if (!cast) {
        return acc;
      }

      cast.forEach((castMember) => {
        if (acc[castMember.name]) {
          const { count } = acc[castMember.name];
          acc[castMember.name] = { castMember, count: count + 1 };
        } else {
          acc[castMember.name] = { castMember, count: 1 };
        }
      });
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1].count - a[1].count)
    .map(([_, item]) => item);

export const computeTopGenres = (movieData) =>
  Object.entries(
    movieData.reduce((acc, movie) => {
      const { genres } = movie;
      if (!genres) {
        return acc;
      }

      genres.forEach((genre) => {
        if (acc[genre]) {
          acc[genre] = acc[genre] + 1;
        } else {
          acc[genre] = 1;
        }
      });
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

export const computeDecadesHistogram = (movieData) =>
  Object.entries(
    movieData.reduce((acc, movie) => {
      const decade = parseInt(movie.releaseDate.slice(0, 3)) * 10;
      const decadeLabel = `${decade}s`;
      if (acc[decadeLabel]) {
        acc[decadeLabel] = acc[decadeLabel] + 1;
      } else {
        acc[decadeLabel] = 1;
      }
      return acc;
    }, {}),
  );

export const monthFromDate = (date) => {
  const dateObj = new Date(date.slice(0, 4), parseInt(date.slice(5, 7)) - 1);
  return dateObj.toLocaleString('default', { month: 'long' });
};

export const computeMonthsHistogram = (movieData) =>
  Object.entries(
    movieData.reduce((acc, movie) => {
      const month = monthFromDate(movie.watchDate);
      if (acc[month]) {
        acc[month] = acc[month] + 1;
      } else {
        acc[month] = 1;
      }
      return acc;
    }, {}),
  );

export const computeTimeSpent = (movieData) =>
  movieData.reduce((acc, movie) => acc + movie.runtime, 0);

export const computeLongestMovie = (movieData) =>
  movieData.reduce(
    (acc, movie) => (movie.runtime > acc.runtime ? movie : acc),
    movieData[0],
  );

export const computeShortestMovie = (movieData) =>
  movieData.reduce(
    (acc, movie) => (movie.runtime < acc.runtime ? movie : acc),
    movieData[0],
  );

export const computeLeastRatedMovie = (movieData) =>
  movieData.reduce(
    (acc, movie) => (movie.voteCount < acc.voteCount ? movie : acc),
    movieData[0],
  );

export const computeMostRatedMovie = (movieData) =>
  movieData.reduce(
    (acc, movie) => (movie.voteCount > acc.voteCount ? movie : acc),
    movieData[0],
  );

export const computeLowestRatedMovie = (movieData) =>
  movieData.reduce(
    (acc, movie) =>
      movie.voteCount > 0 && movie.averageVote < acc.averageVote ? movie : acc,
    movieData[0],
  );

export const computeHighestRatedMovie = (movieData) =>
  movieData.reduce(
    (acc, movie) =>
      movie.voteCount > 0 && movie.averageVote > acc.averageVote ? movie : acc,
    movieData[0],
  );
