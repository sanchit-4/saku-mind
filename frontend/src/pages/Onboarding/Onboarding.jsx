import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Onboarding.module.css';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [locationChoice, setLocationChoice] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Completed onboarding, go to dashboard
      localStorage.setItem('needsOnboarding', 'false');
      navigate('/dashboard');
    }
  };

  const selectLocation = (agreed) => {
    setLocationChoice(agreed);
    // Auto advance after short delay for better UX
    setTimeout(() => {
      setStep(3);
    }, 400);
  };

  return (
    <div className={styles.onboardingPage}>
      
      {/* STEP 1: Welcome Green Squircle Blob */}
      {step === 1 && (
        <div className={styles.stepContainerCenter}>
          <div className={styles.welcomeGreenCard}>
            <h2 className={styles.welcomeTitle}>Welcome to Saku Mind AHEAD</h2>
            
            <div className={styles.circularImageWrapper}>
              <div className={styles.circularImageBorder}>
                <img 
                  src="/8f71ad1e89b50869c1f052048e0066054db9ecd1.png" 
                  alt="Concrete staircase crop" 
                  className={styles.staircaseImage}
                />
              </div>
            </div>

            {/* Next Arrow on the right edge of the card, centered vertically */}
            <button 
              className={styles.cardArrowBtn} 
              onClick={handleNext}
              aria-label="Next Step"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Location banner card, capsule options, and bottom-right arrow link */}
      {step === 2 && (
        <div className={styles.stepContainerLayout}>
          <div className={styles.bannerHeaderCard}>
            <h2 className={styles.bannerTitle}>Do you agree to turn on Location for Saku?</h2>
          </div>

          <div className={styles.stepBodyContent}>
            <p className={styles.descriptionText}>
              Turn on geo location to see partner led activities in your area.
            </p>

            <div className={styles.optionsWrapper}>
              <button 
                className={`${styles.capsuleBtn} ${locationChoice === true ? styles.active : ''}`}
                onClick={() => selectLocation(true)}
              >
                Yes, I agree
              </button>
              <button 
                className={`${styles.capsuleBtn} ${locationChoice === false ? styles.active : ''}`}
                onClick={() => selectLocation(false)}
              >
                No, not now
              </button>
            </div>
          </div>

          {/* Bottom Right next arrow */}
          <div className={styles.bottomRightNavigation}>
            <button 
              className={styles.nextArrowBtn} 
              onClick={handleNext}
              aria-label="Next Step"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Congratulations avatar card, low-poly seed container circular view */}
      {step === 3 && (
        <div className={styles.stepContainerLayout}>
          <div className={styles.bannerHeaderCard}>
            <h2 className={styles.bannerTitle}>Congratulations! Here's your avatar!</h2>
          </div>

          <div className={styles.stepBodyContent}>
            <p className={styles.descriptionText}>
              Here's your avatar seed to start your journey. Do activities, grow your avatar and nurture your wellbeing. View your "My Journey" screen to learn how to take care of your avatar.
            </p>

            {/* Detailed SVG Illustration of Seedling */}
            <div className={styles.seedlingCircleContainer}>
              <svg className={styles.seedlingSvg} viewBox="0 0 120 120" width="120" height="120">
                <defs>
                  <radialGradient id="soilGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fdfcfb" />
                    <stop offset="60%" stopColor="#f0ece9" />
                    <stop offset="100%" stopColor="#d3c7be" />
                  </radialGradient>
                  <linearGradient id="stemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#3a8a6c" />
                    <stop offset="100%" stopColor="#5dc0a0" />
                  </linearGradient>
                </defs>
                
                {/* Circle Container Background */}
                <circle cx="60" cy="60" r="54" fill="url(#soilGlow)" stroke="#f0ece9" strokeWidth="2" />
                
                {/* Soil Mound */}
                <ellipse cx="60" cy="90" rx="35" ry="12" fill="#8d715f" />
                <ellipse cx="60" cy="88" rx="28" ry="8" fill="#705646" />
                <ellipse cx="58" cy="89" rx="15" ry="5" fill="#584133" />
                
                {/* Little Soil Rocks */}
                <circle cx="44" cy="91" r="2" fill="#584133" />
                <circle cx="76" cy="92" r="1.5" fill="#584133" />
                <circle cx="68" cy="94" r="2" fill="#423025" />

                {/* Plant Stem / Sprout */}
                <path 
                  d="M 60 90 Q 56 65 62 45" 
                  fill="none" 
                  stroke="url(#stemGrad)" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                />
                
                {/* Stem highlight */}
                <path 
                  d="M 59 85 Q 56.5 68 61 50" 
                  fill="none" 
                  stroke="#86e7c5" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                />

                {/* Left Leaf */}
                <path 
                  d="M 58 58 C 42 54 36 38 48 36 C 58 35 59 48 59 58 Z" 
                  fill="#5dc0a0" 
                />
                <path 
                  d="M 58 58 C 46 54 44 44 50 40" 
                  fill="none" 
                  stroke="#3a8a6c" 
                  strokeWidth="1" 
                />

                {/* Right Leaf */}
                <path 
                  d="M 61 52 C 78 50 82 34 70 32 C 60 30 61 44 61 52 Z" 
                  fill="#4ab291" 
                />
                <path 
                  d="M 61 52 C 69 49 71 40 66 36" 
                  fill="none" 
                  stroke="#2f7259" 
                  strokeWidth="1" 
                />
                
                {/* Small Budding leaf at the top */}
                <path 
                  d="M 62 45 Q 63 36 67 36 Q 66 43 62 45 Z" 
                  fill="#86e7c5" 
                />

                {/* Glowing Sparkles */}
                <circle cx="34" cy="40" r="1.5" fill="#f26b32" />
                <circle cx="86" cy="48" r="2" fill="#f26b32" />
                <path d="M 28 55 L 30 55 M 29 54 L 29 56" stroke="#f26b32" strokeWidth="1" />
                <path d="M 92 68 L 94 68 M 93 67 L 93 69" stroke="#f26b32" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Bottom Right next arrow to complete */}
          <div className={styles.bottomRightNavigation}>
            <button 
              className={styles.nextArrowBtn} 
              onClick={handleNext}
              aria-label="Start Journey"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Onboarding;
