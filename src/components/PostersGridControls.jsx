import classNames from 'classnames';

import styles from 'styles/PostersGridControls.module.css';
import { filterType, filterValue } from 'filters';
import { ReactComponent as Arrow } from 'img/arrow.svg';
import { ReactComponent as Clear } from 'img/clear.svg';

const PostersGridControls = ({
  selectedFilter,
  posterSort,
  posterSortAscending,
  onChangeFilter,
  onChangePosterSort,
  onChangePosterSortAscending,
}) => (
  <div className={styles.controls}>
    <div>
      <span>
        {selectedFilter ? `${filterType(selectedFilter)}: ` : 'All Movies'}
        {selectedFilter && <b>{filterValue(selectedFilter)}</b>}
      </span>{' '}
      {selectedFilter && (
        <button className={styles.clear} onClick={() => onChangeFilter(null)}>
          <Clear />
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
        <Arrow />
      </button>
    </div>
  </div>
);

export default PostersGridControls;
