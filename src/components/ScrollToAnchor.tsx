// ScrollToAnchor.jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToAnchor() {
  const { hash } = useLocation();
  const lastHash = useRef('');

  useEffect(() => {
    if (hash) {
      lastHash.current = hash.slice(1); // remove the '#'
    }

    if (lastHash.current) {
      const el = document.getElementById(lastHash.current);
      if (el) {
        // slight delay ensures rendering before scroll
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          lastHash.current = '';
        }, 100);
      }
    }
  }, [hash]);

  return null;
}

export default ScrollToAnchor;
