import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './WhatWeDo.module.css';

const WhatWeDo = () => {
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
                src="/91a9bd4d9b0a5a07f812f5473ef6ec98c89f5ba7.png" 
                alt="Saku Mind What We Do banner" 
                className={styles.bannerImage}
              />
            </div>
            
            {/* Main Content Grid — interleaved so mobile stacks in reading order */}
            <main className={styles.mainContent}>

              {/* Row 1, Col 1 — intro text */}
              <div className={styles.paragraphsBlock}>
                <p>Saku Mind's mission is to plant a culture of wellbeing habits to help nurture and grow mental wellbeing.</p>
                <p>To do so, Saku Mind interconnects the individual, the community and the natural world.</p>
                <p>The Saku Mind app, our first product, strengthens these connections, supports users to build lasting habits and celebrates wellbeing growth.</p>
                <p>AHEAD, our latest offering, specifically tackles poor employee mental wellbeing which has staggering financial impact on organisations.</p>
              </div>

              {/* Row 1, Col 2 — Developing connections */}
              <div className={styles.orangeCard}>
                <img src="/developing-connections.png" alt="" className={styles.cardShape} />
                <div className={styles.cardText}>
                  Developing
                  <br />
                  connections
                </div>
              </div>

              {/* Row 2, Col 1 — Nurturing wellbeing */}
              <div className={styles.greenCard}>
                <img src="/nurture-wellbeing.png" alt="" className={styles.cardShape} />
                <div className={styles.cardText}>
                  Nurturing
                  <br />
                  wellbeing
                </div>
              </div>

              {/* Row 2, Col 2 — body text */}
              <div className={styles.paragraphsBlock}>
                <p>Saku Mind products not only serve to prevent mental ill health but also help to elevate human functioning.</p>
                <p>Our products adopt the evidence based Five ways to wellbeing framework with strands of evolutionary and positive psychology, neuroscience, behavioural science, and the concepts of self care, community cohesion and environmental sustainability woven into it.</p>
                <p>Our vision is to transform the wellbeing of work communities and make organisations more productive and successful and the world a happier place.</p>
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

              {/* Row 3, Col 2 — Boosting organisational */}
              <div className={styles.blueCard}>
                <img src="/boosting-organizational.png" alt="" className={styles.cardShape} />
                <div className={styles.cardText}>
                  Boosting
                  <br />
                  organisational
                  <br />
                  performance
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

export default WhatWeDo;
