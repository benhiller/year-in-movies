const fs = require('fs');

const readGeneratedData = async () => {
  const data = await fs.promises.readFile('src/data/movies.json');

  return JSON.parse(data);
};

const findDirector = (movie) => {
  if (!movie.details.credits) {
    return null;
  }

  return movie.details.credits.crew.find(
    (crewMember) => crewMember.job === 'Director',
  ).name;
};

const listCastMembers = (movie) => {
  if (!movie.details.credits) {
    return null;
  }

  return movie.details.credits.cast
    .map((castMember) => {
      if (castMember.character.includes('uncredited')) {
        return null;
      }
      // This seems to match how TMDB determines which actors are 'top billed',
      // though it does not seem very precise
      if (castMember.order > 9) {
        return null;
      }

      return castMember.name;
    })
    .filter((castMember) => !!castMember);
};

const processData = (data) => {
  return data.map((movie) => {
    const processedMovie = {
      title: movie.details.title,
      poster: movie.record.fields.Poster[0].url,
      releaseDate: movie.details.release_date,
      director: findDirector(movie),
      cast: listCastMembers(movie),
      runtime: movie.details.runtime,
      watchDate: movie.record.fields.Date,
      source: movie.record.fields.Source,
      notes: movie.record.fields.Notes,
    };

    return processedMovie;
  });
};

readGeneratedData()
  .then((data) => {
    return fs.promises.writeFile(
      'src/data/processed-movies.json',
      // TODO - remove slice when I want to run this for all movies
      JSON.stringify(processData(data.slice(0, 20))),
    );
  })
  .catch((err) => {
    console.log(err);
  });
