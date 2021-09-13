const fs = require('fs');

const readGeneratedData = async () => {
  const data = await fs.promises.readFile('raw-data/movies.json');

  return JSON.parse(data);
};

const findDirector = (movie) => {
  if (!movie.details.credits) {
    return null;
  }

  return movie.details.credits.crew
    .filter((crewMember) => crewMember.job === 'Director')
    .map((director) => ({
      name: director.name,
      imageSrc: director.profile_path,
    }));
};

const listCastMembers = (movie) => {
  if (!movie.details.credits) {
    return null;
  }

  return movie.details.credits.cast
    .map((castMember) => {
      if (
        !castMember.character ||
        castMember.character.includes('uncredited')
      ) {
        return null;
      }
      // This seems to match how TMDB determines which actors are 'top billed',
      // though it does not seem very precise
      if (castMember.order > 9) {
        return null;
      }

      return {
        name: castMember.name,
        imageSrc: castMember.profile_path,
        position: castMember.order,
      };
    })
    .filter((castMember) => !!castMember);
};

const listGenres = (movie) => {
  if (!movie.details.genres) {
    return null;
  }

  return movie.details.genres.map((genre) => genre.name);
};

const processData = (data) => {
  return data
    .filter((movie) => !movie.record.fields.Type)
    .filter((movie) => !movie.record.fields.Unfinished)
    .filter((movie) => movie.details.id)
    .map((movie) => {
      return {
        title: movie.details.title,
        posterSrc: movie.details.poster_path,
        releaseDate: movie.details.release_date,
        director: findDirector(movie),
        cast: listCastMembers(movie),
        genres: listGenres(movie),
        runtime: movie.details.runtime,
        language: movie.details.original_language,
        voteCount: movie.details.vote_count,
        averageVote: movie.details.vote_average,
        tmdbId: movie.details.id,
        watchDate: movie.record.fields.Date,
        source: movie.record.fields.Source,
      };
    });
};

readGeneratedData()
  .then((data) => {
    return fs.promises.writeFile(
      'src/data/processed-movies.json',
      JSON.stringify(processData(data)),
    );
  })
  .catch((err) => {
    console.log(err);
  });
