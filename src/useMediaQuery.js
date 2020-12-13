import { useEffect, useState } from 'react';

// From https://usehooks.com/useMedia/
const useMediaQuery = (query) => {
  const mediaQuery = window.matchMedia(query);

  const [value, setValue] = useState(mediaQuery.matches);

  useEffect(() => {
    const handler = () => setValue(mediaQuery.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [mediaQuery]);

  return value;
};

export default useMediaQuery;
