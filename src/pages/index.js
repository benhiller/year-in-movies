import Head from 'next/head';
import styles from '../styles/Home.module.css';
import movieData from '../../data/movies.json';

export const getStaticProps = async () => {
  const directors = Object.entries(
    movieData.reduce((acc, movie) => {
      if (!movie.details.credits) {
        return acc;
      }
      const director = movie.details.credits.crew.find(
        (crewMember) => crewMember.job === 'Director',
      );
      if (acc[director.name]) {
        acc[director.name] = acc[director.name] + 1;
      } else {
        acc[director.name] = 1;
      }
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const actors = Object.entries(
    movieData.reduce((acc, movie) => {
      if (!movie.details.credits) {
        return acc;
      }
      movie.details.credits.cast.forEach((castMember) => {
        if (acc[castMember.name]) {
          acc[castMember.name] = acc[castMember.name] + 1;
        } else {
          acc[castMember.name] = 1;
        }
      });
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  return { props: { title: movieData[0].details.title, directors, actors } };
};

const Home = ({ title }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>2020 - Ben&apos;s Year in Movies</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>First movie watched: {title}</main>
    </div>
  );
};

export default Home;
