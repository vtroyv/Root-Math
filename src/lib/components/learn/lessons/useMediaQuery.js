// useMediaQuery.js
import { useState, useEffect } from 'react';

/**
 * Returns true if the current window size matches the given CSS media query.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    // Update if the media query matches or not
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Listener for when the media query match changes
    const listener = () => setMatches(media.matches);
    media.addListener(listener);

    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}
