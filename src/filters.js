import { monthFromDate, labelForMonth } from 'metrics';

export const filterMovies = (movieData, filter) => {
  if (filter.director) {
    return movieData.filter((movie) =>
      movie.director.map((d) => d.name).includes(filter.director),
    );
  } else if (filter.castMember) {
    return movieData.filter(
      (movie) =>
        movie.cast && movie.cast.map((c) => c.name).includes(filter.castMember),
    );
  } else if (filter.decade) {
    return movieData.filter((movie) =>
      movie.releaseDate.startsWith(filter.decade.slice(0, 3)),
    );
  } else if (filter.genre) {
    return movieData.filter((movie) => movie.genres.includes(filter.genre));
  } else if (filter.month) {
    return movieData.filter(
      (movie) => labelForMonth(monthFromDate(movie.watchDate)) === filter.month,
    );
  }
};

export const filterType = (filter) => {
  if (filter.director) {
    return 'Director';
  } else if (filter.castMember) {
    return 'Actor';
  } else if (filter.decade) {
    return 'Release Year';
  } else if (filter.genre) {
    return 'Genre';
  } else if (filter.month) {
    return 'Watched in';
  }
};

export const filterValue = (filter) => {
  if (filter.director) {
    return filter.director;
  } else if (filter.castMember) {
    return filter.castMember;
  } else if (filter.decade) {
    return filter.decade;
  } else if (filter.genre) {
    return filter.genre;
  } else if (filter.month) {
    return filter.month;
  }
};
