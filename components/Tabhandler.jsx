'use client';

import { useEffect } from 'react';

const TabTitleHandler = () => {
  useEffect(() => {
    const originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Hey, come back! 👋";
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default TabTitleHandler;