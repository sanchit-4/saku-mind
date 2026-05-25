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
            
            {/* Main Content Details Grid */}
            <main className={styles.mainContent}>
              
              {/* Left Content Column */}
              <div className={styles.contentColumn}>
                <div className={styles.paragraphsBlock}>
                  <p>
                    Imagine your organisation with increased productivity and greater employee engagement.
                  </p>
                  <p>
                    Imagine your teams more cohesive and innovative.
                  </p>
                  <p>
                    Imagine your organisation positively impacting the natural environment to help meet sustainability goals.
                  </p>
                </div>
                
                <div className={styles.pinkCard}>
                  <div className={styles.cardText}>
                    AHEAD
                    <br />
                    Saku Mind’s
                    <br />
                    transformational
                    <br />
                    mental wellbeing
                    <br />
                    programme
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
                <div className={styles.cyanCard}>
                  <div className={styles.cardText}>
                    Unleash the
                    <br />
                    potential of your
                    <br />
                    organisation!
                  </div>
                </div>
                
                <div className={`${styles.paragraphsBlock} ${styles.rightTextPadding}`}>
                  <p>
                    Make the workday an opportunity to elevate mental wellbeing with Saku's AHEAD activities seamlessly woven into it.
                  </p>
                  <p>
                    AHEAD’s wellbeing activities are simple yet impactful, short yet effective, intentional yet fun, and are adapted to a given work environment and wrapped up in easy habit building modes.
                  </p>
                  <p>
                    AHEAD boosts both individual and collective wellbeing, thereby enhancing productivity and operational effectiveness of your organisation.
                  </p>
                  <p>
                    From mental wellbeing audit to impact measurement, leverage Saku Mind’s AHEAD to transform your organisation.
                  </p>
                  <p className={styles.learnMoreLine}>
                    <a href="/saku-ahead" className={styles.learnMoreLink}>Learn more</a> about AHEAD.
                  </p>
                </div>
                
                <div className={styles.greenCard}>
                  <div className={styles.cardText}>
                    Change the
                    <br />
                    narrative! Connect
                    <br />
                    with us today to
                    <br />
                    reshape your
                    <br />
                    organisation
                  </div>
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
