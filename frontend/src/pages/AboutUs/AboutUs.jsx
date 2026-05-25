import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.appContainer}>
        <div className={styles.mainLayout}>
          
          {/* Sidebar */}
          <Sidebar />
          
          {/* Right Content */}
          <div className={styles.rightContent}>
            
            {/* Top Banner Box */}
            <div className={styles.bannerContainer}>
              <img 
                src="/09be2ee05d900b8fe978af47b10d2b1ef23d0816.png" 
                alt="Saku Mind About Us banner" 
                className={styles.bannerImage}
              />
            </div>
            
            {/* Main Content Details Grid */}
            <main className={styles.mainContent}>
              
              {/* Left Content Column */}
              <div className={styles.contentColumn}>
                <div className={styles.paragraphsBlock}>
                  <p>
                    A diverse group of strangers from across the globe met virtually in a hackathon during the pandemic and envisioned a product that would be our gift to the future.
                  </p>
                  <p>
                    We acknowledged that the world was increasingly challenged by global, societal, and technological upheavals, compromising mental wellbeing.
                  </p>
                  <p>
                    Drawing on our own personal wellbeing journeys, and decades of research findings it became evident that the two indisputable pillars of great mental wellbeing are nature connectedness and social connectedness.
                  </p>
                  <p>
                    The Japanese Zen concept – Enso: the instantaneous moment where the mind is free to let the body create – resonated with us and what we wanted to provide our clients.
                  </p>
                </div>
                
                <div className={styles.cyanCard}>
                  <div className={styles.cardText}>
                    The
                    <br />
                    Journey
                  </div>
                </div>
                
                <div className={styles.cycleImageContainer}>
                  <img 
                    src="/e56da35e3af2c1cc2ea11dd001777d144d108219.png" 
                    alt="Saku five ways to wellbeing process cycle" 
                    className={styles.cycleImage}
                  />
                </div>
              </div>
              
              {/* Right Content Column */}
              <div className={styles.contentColumn}>
                <div className={styles.pinkCard}>
                  <div className={styles.cardText}>
                    The
                    <br />
                    beginning
                  </div>
                </div>

                <div className={styles.paragraphsBlock}>
                  <p>
                    We chose the name Saku, which translates to “bloom” in Japanese. It captures our ethos, highlighting the importance to re-focus, energise, and make the most out of life.
                  </p>
                  <p>
                    As our first product, we developed the self driven Saku Mind app to help people connect with nature and community and improve mental wellbeing.
                  </p>
                  <p>
                    We recognised that Saku would have most impact if adopted by workplace communities, strengthening the individual and those around them, individual and collective wellbeing positively impacting each other.
                  </p>
                  <p>
                    With the Saku mind app as our launchpad - spending years piloting studies, listening, learning and developing impactful new mental wellbeing solutions for organisations.
                  </p>
                  <p>
                    This has culminated in the comprehensive AHEAD programme.
                  </p>
                  <p className={styles.learnMoreLine}>
                    <a href="/saku-ahead" className={styles.learnMoreLink}>Learn more</a> about AHEAD.
                  </p>
                </div>
                
                <div className={styles.greenCard}>
                  <div className={styles.cardText}>
                    The
                    <br />
                    ascent
                  </div>
                </div>
              </div>
              
            </main>
            
          </div>
          
        </div>
        
        {/* Footer */}
        <Footer />
        
      </div>
    </div>
  );
};

export default AboutUs;
