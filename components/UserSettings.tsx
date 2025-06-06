/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react'; // Ensure React is imported if not already
import Modal from './Modal';
import { useUI, useUser } from '@/lib/state';

export default function UserSettings() {
  const { name, info, setName, setInfo } = useUser();
  const { setShowUserConfig } = useUI();

  const mobileBreakpoint = 768; // Or your preferred breakpoint
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : mobileBreakpoint);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Guard against SSR or test environments without window

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    // Call handleResize once initially to set the correct width
    // (though useState already does this, but good for explicit first paint setup if needed)
    // handleResize(); // Initial call is handled by useState default value now.

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount


  function updateClient() {
    localStorage.setItem('hasCompletedUserSetup', 'true');
    setShowUserConfig(false);
  }

  const userSettingsStyle: React.CSSProperties = {
    // Default styles (desktop)
    width: '480px', // Matches current CSS if needed, or can be omitted if CSS handles it
    padding: '0px', // Override internal padding if any, rely on Modal's padding or set specific
    margin: '0 auto', // Center it if Modal doesn't already
  };

  if (screenWidth < mobileBreakpoint) {
    userSettingsStyle.width = 'calc(100% - 20px)'; // Take full width minus some margin
    userSettingsStyle.maxWidth = '400px'; // Max width on mobile to prevent it being too wide on larger "mobile"
    userSettingsStyle.padding = '20px'; // Reduced padding for mobile
    userSettingsStyle.margin = '10px auto'; // Add some vertical margin and keep it centered
  }

  const paragraphStyle: React.CSSProperties = {
    // Default styles (desktop)
    fontSize: '18px', // Explicitly set to match current CSS or desired desktop size
    lineHeight: '1.5', // Matches current CSS
    // Add any other base styles you want to ensure and can control here
  };

  if (screenWidth < mobileBreakpoint) {
    paragraphStyle.fontSize = '15px'; // Reduced font size for mobile
    paragraphStyle.lineHeight = '1.4'; // Slightly adjusted line height for smaller font
  }

  const formStyle: React.CSSProperties = {
    marginTop: '10px',
    paddingTop: '20px',
    borderTop: '1px solid var(--gray-800)'
  };

  const formRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: screenWidth < mobileBreakpoint ? '6px' : '10px', // Reduced gap for mobile
    fontSize: screenWidth < mobileBreakpoint ? '14px' : '16px', // Base font for label text
  };

  const inputStyle: React.CSSProperties = {
    padding: screenWidth < mobileBreakpoint ? '10px' : '12px', // Slightly larger padding
    fontSize: screenWidth < mobileBreakpoint ? '15px' : '16px',
    border: `1px solid var(--Neutral-30, #404547)`, // Softer border, with fallback
    borderRadius: '8px', // Slightly more modern radius
    backgroundColor: `var(--Neutral-5, #181a1b)`, // Darker background for inputs
    color: `var(--Neutral-90, #e1e2e3)`, // Light text
    resize: 'none', // For textarea
    width: '100%', // Ensure inputs take full width of their container
    boxSizing: 'border-box', // Important if padding affects width
  };

  const buttonStyle: React.CSSProperties = {
    padding: screenWidth < mobileBreakpoint ? '10px 15px' : '12px 20px',
    fontSize: screenWidth < mobileBreakpoint ? '15px' : '16px',
    backgroundColor: `var(--Blue-500, #007bff)`,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    width: '100%',
    marginTop: screenWidth < mobileBreakpoint ? '15px' : '20px',
  };

  if (screenWidth >= mobileBreakpoint) {
    buttonStyle.width = 'auto';
    buttonStyle.alignSelf = 'flex-end';
  }


  return (
    <Modal onClose={() => setShowUserConfig(false)}>
      <div className="userSettings" style={userSettingsStyle}>
        <p style={paragraphStyle}>
          This is a simple tool that allows you to design, test, and banter with
          custom AI characters on the fly.
        </p>

        <form
          onSubmit={e => {
            e.preventDefault();
            localStorage.setItem('hasCompletedUserSetup', 'true');
            setShowUserConfig(false);
            updateClient(); // updateClient also sets localStorage, but it's fine for this case
          }}
          style={formStyle}
        >
          <p style={paragraphStyle}>Adding this optional info makes the experience more fun:</p>

          <div style={formRowStyle}>
            Your name
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="What do you like to be called?"
              style={inputStyle}
            />
          </div>

          <div style={formRowStyle}>
            Your info
            <textarea
              rows={3}
              value={info}
              onChange={e => setInfo(e.target.value)}
              placeholder="Things we should know about you… Likes, dislikes, hobbies, interests, favorite movies, books, tv shows, foods, etc."
              style={{...inputStyle, height: screenWidth < mobileBreakpoint ? '60px' : '80px' }}
            />
          </div>

          <button className="button primary" style={buttonStyle}>Let’s go!</button>
        </form>
      </div>
    </Modal>
  );
}
