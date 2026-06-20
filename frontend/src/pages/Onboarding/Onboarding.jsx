import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../components/AuthContext/AuthContext';
import styles from './Onboarding.module.css';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const { currentUser, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Mark onboarding complete in Firestore
      try {
        if (currentUser) {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            needsOnboarding: false
          });
          // Refresh profile so DashboardRoute allows access
          await fetchUserProfile(currentUser.uid);
        }
      } catch (err) {
        console.error('Error updating onboarding status:', err);
      }
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.onboardingPage}>
      
      {/* STEP 1: Welcome — Green squircle with circular image */}
      {step === 1 && (
        <div className={styles.stepContainerCenter}>
          <div className={styles.welcomeGreenCard}>
            <h2 className={styles.welcomeTitle}>Welcome to Saku Mind AHEAD</h2>
            
            <div className={styles.circularImageWrapper}>
              <div className={styles.circularImageBorder}>
                <img 
                  src="/login-scree-logo.png" 
                  alt="Saku Mind Step Ahead" 
                  className={styles.staircaseImage}
                />
              </div>
            </div>

            <button 
              className={styles.cardArrowBtn} 
              onClick={handleNext}
              aria-label="Next Step"
            >
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Congratulations — Avatar reveal */}
      {step === 2 && (
        <div className={styles.stepContainerLayout}>
          <div className={styles.bannerHeaderCard}>
            <h2 className={styles.bannerTitle}>Congratulations! Here's your avatar!</h2>
          </div>

          <div className={styles.stepBodyContent}>
            <p className={styles.descriptionText}>
              Here's your avatar seed to start your journey. Do activities, grow your avatar and nurture your wellbeing.
            </p>

            <p className={styles.descriptionText}>
              View your "My Journey" screen to learn how to take care of your avatar.
            </p>

            <div className={styles.avatarCircleContainer}>
              <img 
                src="/avatars/a1.png" 
                alt="Your Avatar Seed" 
                className={styles.avatarImage}
              />
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
