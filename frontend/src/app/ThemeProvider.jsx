import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const theme = useSelector((state) => state.chat.theme);
  const firstRender = useRef(true);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // No animation on first render
    if (firstRender.current) {
      if (theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
      firstRender.current = false;
      return;
    }

    // Use View Transitions API if available
    if (!document.startViewTransition) {
      if (theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
      return;
    }

    document.startViewTransition(() => {
      if (theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    });
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
