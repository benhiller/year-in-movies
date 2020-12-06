import Head from 'next/head';
import styles from '../styles/Home.module.css';
import movieData from '../../data/movies.json';

export const getStaticProps = async (context) => {
  return { props: { title: movieData[0].details.title } };
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
