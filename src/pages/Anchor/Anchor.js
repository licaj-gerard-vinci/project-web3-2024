import React, { useState, useEffect } from 'react';
import ScrollToTop from 'react-scroll-to-top';
import { FaArrowUp } from 'react-icons/fa'; // Arrow icon

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we are at the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      setIsVisible(isAtBottom); // Set visibility of the button based on scroll position
    };

    // Add event listener to track scroll position
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <ScrollToTop
        smooth
        component={<FaArrowUp size={24} />}
        style={{
            position: 'fixed',
            bottom: '30px', // Space from the bottom of the screen
            right: '30px', // Space from the right of the screen
            backgroundColor: 'transparent', // Remove the background color
            borderRadius: '50%', // Circular shape
            color: '#fff', // Text color
            padding: '12px', // Padding around the arrow
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', // Shadow for a floating effect
            zIndex: 1000, // Ensure the button is above other content
            cursor: 'pointer', // Indicate that it's clickable
            display: 'flex', 
            justifyContent: 'center', // Center the arrow
            alignItems: 'center', // Center the arrow
            transition: 'transform 0.2s ease', // Smooth transform effect for hover
        }}
      />
    )
  );
};

export default ScrollToTopButton;