import styles from 'styles/Footer.module.css';
import { ReactComponent as TMDbLogo } from 'img/tmdb-logo.svg';
import { ReactComponent as GitHubLogo } from 'img/github-logo.svg';
import me from 'img/me.jpg';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <p className={styles.footerRow}>
        <img src={me} alt="Me" className={styles.roundedFooterIcon} />
        <span>
          Created by{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/benhiller"
          >
            Ben Hiller
          </a>
          .
        </span>
      </p>
      <p className={styles.footerRow}>
        <a target="_blank" rel="noreferrer" href="https://www.themoviedb.org/">
          <TMDbLogo className={styles.footerIcon} />
        </a>
        <span>
          This product uses the{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://developers.themoviedb.org/"
          >
            TMDb API
          </a>{' '}
          but is not endorsed or certified by TMDb.
        </span>
      </p>
      <p className={styles.footerRow}>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/benhiller/year-in-movies"
        >
          <GitHubLogo className={styles.footerIcon} />
        </a>
        <span>
          View the source on{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/benhiller/year-in-movies"
          >
            GitHub
          </a>
          .
        </span>
      </p>
    </div>
  );
};

export default Footer;
