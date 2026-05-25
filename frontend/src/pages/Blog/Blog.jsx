import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './Blog.module.css';

const Blog = () => {
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
                src="/dff7400f7553327acf8b93f038ea290d3de448cb.png" 
                alt="Saku Mind Blog banner" 
                className={styles.bannerImage}
              />
            </div>
            
            {/* Main Content Card */}
            <main className={styles.mainContent}>
              <div className={styles.comingSoonContainer}>
                <h1 className={styles.comingSoonText}>Coming soon</h1>
                <p className={styles.comingSoonSubtext}>
                  Our editorial team is busy preparing articles and stories about mindfulness, nature connectedness, and organisational wellbeing. Check back soon!
                </p>
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

export default Blog;
