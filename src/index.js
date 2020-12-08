import React from 'react';
import ReactDOM from 'react-dom';

import './styles/globals.css';
import App from './App';
import movieData from './data/processed-movies.json';

ReactDOM.render(
  <React.StrictMode>
    <App movieData={movieData} />
  </React.StrictMode>,
  document.getElementById('root'),
);
