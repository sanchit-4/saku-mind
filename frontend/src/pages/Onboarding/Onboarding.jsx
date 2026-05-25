import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Onboarding.module.css';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [notificationChoice, setNotificationChoice] = useState(null);
  const [locationChoice, setLocationChoice] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Completed onboarding
      localStorage.setItem('needsOnboarding', 'false');
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      // If they go back from step 1, we log them out or redirect to login
      navigate('/secure-login');
    }
  };

  const selectNotification = (agreed) => {
    setNotificationChoice(agreed);
    // Automatically transition to next step after choice for smooth flow
    setTimeout(() => {
      setStep(2);
    }, 400);
  };

  const selectLocation = (agreed) => {
    setLocationChoice(agreed);
    setTimeout(() => {
      setStep(3);
    }, 400);
  };

  return (
    <div className={styles.onboardingPage}>
      {/* Centered Mobile Mockup Container */}
      <div className={styles.mobileCard}>
        {/* Top bar with back arrow */}
        <header className={styles.cardHeader}>
          <button 
            className={styles.backButton} 
            onClick={handleBack} 
            aria-label="Back"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <span className={styles.stepIndicator}>Step {step} of 3</span>
        </header>

        {/* Content Area with dynamic step rendering */}
        <div className={styles.cardContent}>
          {step === 1 && (
            <div className={styles.stepContainer}>
              <div className={styles.illustrationWrapper}>
                {/* Custom Bell SVG */}
                <div className={styles.iconCircle}>
                  <svg viewBox="0 0 24 24" className={styles.iconSvg} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span className={styles.pulseDot}></span>
                </div>
              </div>
              <h2 className={styles.title}>Do you agree to turn on notifications for Saku?</h2>
              <p className={styles.description}>Saku would keep you up to date via push notifications.</p>
              
              <div className={styles.optionsWrapper}>
                <button 
                  className={`${styles.optionBtn} ${notificationChoice === true ? styles.active : ''}`}
                  onClick={() => selectNotification(true)}
                >
                  Yes, I agree
                </button>
                <button 
                  className={`${styles.optionBtn} ${notificationChoice === false ? styles.active : ''}`}
                  onClick={() => selectNotification(false)}
                >
                  No, not now
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContainer}>
              <div className={styles.illustrationWrapper}>
                {/* Custom Location PIN SVG */}
                <div className={styles.iconCircle}>
                  <svg viewBox="0 0 24 24" className={styles.iconSvg} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className={styles.pulseDot}></span>
                </div>
              </div>
              <h2 className={styles.title}>Do you agree to turn on Location for Saku?</h2>
              <p className={styles.description}>Turn on geo location to see partner led activities in your area.</p>

              <div className={styles.optionsWrapper}>
                <button 
                  className={`${styles.optionBtn} ${locationChoice === true ? styles.active : ''}`}
                  onClick={() => selectLocation(true)}
                >
                  Yes, I agree
                </button>
                <button 
                  className={`${styles.optionBtn} ${locationChoice === false ? styles.active : ''}`}
                  onClick={() => selectLocation(false)}
                >
                  No, not now
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContainer}>
              <div className={styles.avatarWrapper}>
                {/* Glowing Avatar Seed graphic */}
                <div className={styles.avatarBlob}>
                  <svg viewBox="0 0 100 100" className={styles.avatarSvg}>
                    {/* Cute glowing seed vector */}
                    <defs>
                      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#d9f2ec" />
                        <stop offset="100%" stopColor="#5dc0a0" stopOpacity="0.2" />
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="65" r="28" fill="url(#glow)" />
                    {/* The seed base */}
                    <path d="M50 35 C42 55, 30 75, 50 78 C70 75, 58 55, 50 35 Z" fill="#f26b32" />
                    {/* Tiny green leaves sprout */}
                    <path d="M50 35 C48 30, 42 28, 43 24 C46 24, 49 28, 50 35 Z" fill="#5dc0a0" />
                    <path d="M50 35 C52 30, 58 28, 57 24 C54 24, 51 28, 50 35 Z" fill="#5dc0a0" />
                    {/* Cute face */}
                    <circle cx="45" cy="58" r="1.5" fill="#ffffff" />
                    <circle cx="55" cy="58" r="1.5" fill="#ffffff" />
                    <path d="M48 65 Q50 67 52 65" stroke="#ffffff" strokeWidth="1" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <h2 className={styles.title}>Congratulations! Here’s your avatar!</h2>
              <p className={styles.description}>
                Here’s your avatar seed to start your journey. Do activities, grow your avatar and nurture your wellbeing. View your “My Journey” screen to learn how to take care of your avatar.
              </p>

              <button 
                className={styles.finishBtn}
                onClick={handleNext}
              >
                Start Journey
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
