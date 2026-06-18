import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.appContainer}>
        {/* Main Section containing Sidebar & Content columns */}
        <div className={styles.mainLayout}>
          
          {/* Reusable Left Sidebar */}
          <Sidebar />
          
          {/* Right Section Content */}
          <div className={styles.rightContent}>
            
            {/* Top Banner Box */}
            <div className={styles.bannerContainer}>
              <img 
                src="/b22e67615500c1585e40d2a0c9c0344c249c194b.png" 
                alt="Saku Mind Step Ahead banner" 
                className={styles.bannerImage}
              />
            </div>
            
            {/* Main Content Grid — interleaved so mobile stacks in reading order */}
            <main className={styles.mainContent}>

              {/* Row 1, Col 1 — intro text */}
              <div className={styles.paragraphsBlock}>
                <p>Imagine your organisation with increased productivity and greater employee engagement.</p>
                <p>Imagine your teams more cohesive and innovative.</p>
                <p>Imagine your organisation positively impacting the natural environment to help meet sustainability goals.</p>
                <p>Go from taxing to transformative workdays.</p>
              </div>

              {/* Row 1, Col 2 — Unleash card */}
              <div className={styles.cyanCard}>
                <img src="/unleash-potential.png" alt="" className={styles.cardShape} />
                <div className={styles.cardText}>
                  Unleash the
                  <br />
                  potential of your
                  <br />
                  organisation
                </div>
              </div>

              {/* Row 2, Col 1 — AHEAD card */}
              <div className={styles.pinkCard}>
                <img src="/ahead-saku-mind.png" alt="" className={styles.cardShape} />
                <div className={styles.cardText}>
                  AHEAD
                  <br />
                  Saku Mind's
                  <br />
                  transformational
                  <br />
                  mental wellbeing
                  <br />
                  programme
                </div>
              </div>

              {/* Row 2, Col 2 — body text */}
              <div className={`${styles.paragraphsBlock} ${styles.rightTextPadding}`}>
                <p>Make the workday an opportunity to elevate mental functioning and wellbeing with Saku's AHEAD activities seamlessly woven into it.</p>
                <p>AHEAD's wellbeing activities are simple yet impactful, short yet effective, intentional yet fun, and are adapted to a given work environment and wrapped up in easy habit building modes.</p>
                <p>AHEAD boosts both individual and collective wellbeing, thereby enhancing productivity and operational effectiveness of your organisation.</p>
                <p>From mental wellbeing audit to impact measurement, leverage Saku Mind's AHEAD to transform your organisation.</p>
                <p className={styles.learnMoreLine}>
                  <a href="/saku-ahead" className={styles.learnMoreLink}>Learn more</a> about AHEAD.
                </p>
              </div>

              {/* Row 3, Col 1 — Saku cycle logo */}
              <div className={styles.cycleImageContainer}>
                <img
                  src="/e56da35e3af2c1cc2ea11dd001777d144d108219.png"
                  alt="Saku five ways to wellbeing process cycle"
                  className={styles.cycleImage}
                />
              </div>

              {/* Row 3, Col 2 — Change narrative card */}
              <div className={styles.greenCard}>
                <img src="/change-narrative.png" alt="" className={styles.cardShape} />
                <div className={styles.cardText}>
                  Change the
                  <br />
                  narrative Connect
                  <br />
                  with us today to
                  <br />
                  reshape your
                  <br />
                  organisation
                </div>
              </div>

            </main>
          </div>
          
        </div>
        
        {/* Reusable Footer */}
        <Footer />
        
      </div>
    </div>
  );
};

export default Home;
