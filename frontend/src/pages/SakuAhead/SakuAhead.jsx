import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './SakuAhead.module.css';

const SakuAhead = () => {
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
                src="/8f71ad1e89b50869c1f052048e0066054db9ecd1.png" 
                alt="Saku Mind AHEAD banner" 
                className={styles.bannerImage}
              />
            </div>
            
            {/* Main Content Details Grid */}
            <main className={styles.mainContent}>
              
              {/* Left Content Column */}
              <div className={styles.contentColumn}>
                <div className={styles.paragraphsBlock}>
                  <p>
                    AHEAD is a 5 product organisational transformation programme integrating SakuMind 360, SakuMind Focus, SakuMind Roll-Ahead, SakuMind Eye and SakuMind Impact.
                  </p>
                  <p>
                    AHEAD incorporates a 5 step progress process, with each of the 5 steps focusing on boosting resilience, positivity, balance, growth and bloom, respectively.
                  </p>
                  <p>
                    Activities are based on the 5 ways to well being, Be Active, Connect, Give, Keep Learning and Take Notice, and intentionally designed to enhance nature connectedness and social connectedness, the two essential pillars of great mental wellbeing.
                  </p>
                </div>
                
                <div className={styles.orangeCard}>
                  <div className={styles.cardText}>
                    Five
                    <br />
                    steps
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
                <div className={styles.greenCard}>
                  <div className={styles.cardText}>
                    Five
                    <br />
                    products
                  </div>
                </div>

                <div className={styles.paragraphsBlock}>
                  <p>
                    Every organisation is unique. Saku’s AHEAD programme works to first understand the pulse and persona of an organisation before custom formulating an action plan to transform the organisation.
                  </p>
                  <p>
                    AHEAD continuously monitors and provides support to maximise the benefits of undertaking the programme.
                  </p>
                  <p>
                    Each progress step culminates with an impact measurement report capturing improvement in both wellbeing parameters and organisation performance parameters.
                  </p>
                  <p>
                    Connect with us today to learn more about how micro habits can have macro benefits.
                  </p>
                </div>
                
                <div className={styles.pinkCard}>
                  <div className={styles.cardText}>
                    Five ways to
                    <br />
                    wellbeing
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

export default SakuAhead;
