import { useEffect, useState } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    // innerHeight doesn't seem 100% reliable after rotation on iOS, maybe just
    // the simulator? Test if this happens on my iPhone
    // const intervalId = setInterval(handleResize, 250);

    return () => {
      window.removeEventListener('resize', handleResize);
      // clearInterval(intervalId);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
