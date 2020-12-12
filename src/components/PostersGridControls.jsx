import classNames from 'classnames';

import styles from 'styles/PostersGridControls.module.css';

const PostersGridControls = ({
  currentTitle,
  selectedFilter,
  posterSort,
  posterSortAscending,
  onChangeFilter,
  onChangePosterSort,
  onChangePosterSortAscending,
}) => (
  <div className={styles.controls}>
    <div>
      <span>{currentTitle}</span>{' '}
      {selectedFilter && (
        <button className={styles.clear} onClick={() => onChangeFilter(null)}>
          {'\u2716'}
        </button>
      )}
    </div>
    <div>
      <label>
        Sort:{' '}
        <select
          id="poster-sort"
          value={posterSort}
          onChange={(e) => onChangePosterSort(e.target.value)}
        >
          <option value="watch-date">Watch Date</option>
          <option value="release-date">Release Date</option>
          <option value="average-rating">Average Rating</option>
          <option value="num-ratings">Number of Ratings</option>
          <option value="runtime">Runtime</option>
        </select>
      </label>{' '}
      <button
        className={classNames(styles.toggleOrder, {
          [styles.toggleOrderDesc]: !posterSortAscending,
          [styles.toggleOrderAsc]: posterSortAscending,
        })}
        onClick={() => onChangePosterSortAscending(!posterSortAscending)}
      >
        &uarr;
      </button>
    </div>
  </div>
);

export default PostersGridControls;
