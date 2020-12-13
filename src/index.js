import React from 'react';
import { hydrate, render } from 'react-dom';

import 'styles/globals.css';
import App from 'components/App';
import movieData from 'data/processed-movies.json';

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(
    <React.StrictMode>
      <App movieData={movieData} />
    </React.StrictMode>,
    rootElement,
  );
} else {
  render(
    <React.StrictMode>
      <App movieData={movieData} />
    </React.StrictMode>,
    rootElement,
  );
}
