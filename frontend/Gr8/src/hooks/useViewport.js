import { useState, useEffect } from 'react';

// Define breakpoints for responsive design.
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

// Custom hook to track viewport width and determine device type.
const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine device type based on current width and defined breakpoints.
  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.tablet;

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
  };
};

export default useViewport;