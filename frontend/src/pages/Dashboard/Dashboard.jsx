import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [avatarLevel, setAvatarLevel] = useState(1);
  const [recordedLogs, setRecordedLogs] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRecordActivity = () => {
    // Record current time and mock mood check-in
    const newLog = {
      id: Date.now(),
      activity: "Outdoor Yin Yoga",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    };
    setRecordedLogs([newLog, ...recordedLogs]);
    
    // Growth logic: increment avatar level up to level 4
    if (avatarLevel < 4) {
      setAvatarLevel(prev => prev + 1);
      setSuccessMessage('Congratulations! Activity recorded, your Saku Avatar has grown!');
    } else {
      setSuccessMessage('Activity recorded! Your Saku Avatar is at maximum bloom!');
    }

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.appContainer}>
        <div className={styles.mainLayout}>
          
          {/* Sticky Sidebar */}
          <Sidebar />

          {/* Right Workspace Column */}
          <div className={styles.rightContent}>
            
            {/* Header / Top banner */}
            <div className={styles.bannerContainer}>
              <div className={styles.bannerText}>
                <h1>My Saku Activity</h1>
                <p>Welcome back! Complete a Saku activity and record how you are feeling to collect elements and grow your avatar.</p>
              </div>
            </div>

            {/* Success Toast */}
            {successMessage && (
              <div className={styles.successToast}>
                {successMessage}
              </div>
            )}

            {/* Dashboard workspace grid */}
            <main className={styles.mainContent}>
              
              {/* Left Column: Focused Activity */}
              <div className={styles.contentColumn}>
                <div className={styles.activityHeader}>
                  <span className={styles.sectionLabel}>Active Session</span>
                  <h2>Outdoor Yin Yoga</h2>
                </div>

                <div className={styles.detailsBlock}>
                  <div className={styles.detailCard}>
                    <strong>What</strong>
                    <p>A unique spin on the common practice of yin yoga. Yin yoga is a slow paced style of yoga that incorporates principles of Chinese medicine. You'll practice balance with asanas (postures) that are held for longer periods of time than in other styles of yoga.</p>
                  </div>

                  <div className={styles.detailCard}>
                    <strong>Why</strong>
                    <p>The continued practice of yoga boosts focus, concentration, better decision making, emotional and impulse control. The practice of yoga is also known to increase gray matter density.</p>
                  </div>

                  <div className={styles.detailCard}>
                    <strong>How</strong>
                    <p>Check out the recommended video, ‘Yin Yoga Deep Stretch Class’ for key postures such as the butterfly, pigeon, and dragon. Find yourself a tranquil spot to practice them to achieve true calm and develop inner strength.</p>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <button 
                    className={styles.primaryBtn}
                    onClick={() => setShowVideoModal(true)}
                  >
                    Activity guide
                  </button>
                  <button 
                    className={styles.secondaryBtn}
                    onClick={handleRecordActivity}
                  >
                    Record activity
                  </button>
                </div>
              </div>

              {/* Right Column: Avatar Growth & Activity History */}
              <div className={styles.contentColumn}>
                
                {/* Interactive Avatar Container */}
                <div className={styles.avatarCard}>
                  <h3>Saku Journey</h3>
                  
                  <div className={styles.avatarVisual}>
                    <svg viewBox="0 0 100 100" className={styles.avatarSvg}>
                      <defs>
                        <radialGradient id="bloomGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#eef9f6" />
                          <stop offset="100%" stopColor="#5dc0a0" stopOpacity="0.2" />
                        </radialGradient>
                      </defs>
                      <circle cx="50" cy="65" r="30" fill="url(#bloomGlow)" />
                      
                      {/* Growth rendering depends on avatarLevel */}
                      {avatarLevel >= 1 && (
                        /* The seed base */
                        <path d="M50 40 C44 55, 36 75, 50 78 C64 75, 56 55, 50 40 Z" fill="#f26b32" />
                      )}
                      
                      {avatarLevel >= 2 && (
                        /* Small sprout */
                        <>
                          <path d="M50 40 C48 33, 40 31, 41 26 C44 26, 48 32, 50 40 Z" fill="#5dc0a0" />
                          <path d="M50 40 C52 33, 60 31, 59 26 C56 26, 52 32, 50 40 Z" fill="#5dc0a0" />
                        </>
                      )}

                      {avatarLevel >= 3 && (
                        /* Stem grows, larger leaves */
                        <>
                          <path d="M50 35 C42 22, 34 22, 37 14 C44 16, 46 25, 50 35 Z" fill="#2dbec9" />
                          <path d="M50 35 C58 22, 66 22, 63 14 C56 16, 54 25, 50 35 Z" fill="#2dbec9" />
                        </>
                      )}

                      {avatarLevel >= 4 && (
                        /* Flower Bloom */
                        <circle cx="50" cy="15" r="10" fill="#f37d92" className={styles.blossom} />
                      )}

                      {/* Face */}
                      <circle cx="46" cy="60" r="1.5" fill="#ffffff" />
                      <circle cx="54" cy="60" r="1.5" fill="#ffffff" />
                      <path d="M48 66 Q50 68 52 66" stroke="#ffffff" strokeWidth="1" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>

                  <span className={styles.avatarLabel}>
                    {avatarLevel === 1 && "Seed Stage"}
                    {avatarLevel === 2 && "Sprouting Stage"}
                    {avatarLevel === 3 && "Growing Stage"}
                    {avatarLevel === 4 && "Fully Bloomed! 🎉"}
                  </span>
                </div>

                {/* Personal Favourites list */}
                <div className={styles.favouritesBlock}>
                  <h3>Personal Favourites</h3>
                  {recordedLogs.length === 0 ? (
                    <p className={styles.noHistoryText}>No activities recorded yet. Complete sessions to build your logs.</p>
                  ) : (
                    <ul className={styles.logsList}>
                      {recordedLogs.map(log => (
                        <li key={log.id} className={styles.logItem}>
                          <div className={styles.logTitle}>
                            <span>🧘 {log.activity}</span>
                            <span className={styles.logTimestamp}>{log.time}</span>
                          </div>
                          <span className={styles.logDate}>{log.date}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

            </main>
          </div>
        </div>

        {/* Reusable Footer */}
        <Footer />

      </div>

      {/* Embedded YouTube modal */}
      {showVideoModal && (
        <div className={styles.modalOverlay} onClick={() => setShowVideoModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h4>Yin Yoga Deep Stretch Class</h4>
              <button className={styles.closeModalBtn} onClick={() => setShowVideoModal(false)} aria-label="Close modal">
                &times;
              </button>
            </div>
            <div className={styles.videoResponsive}>
              <iframe
                src="https://www.youtube.com/embed/v7AYKJDqy4U"
                title="Yin Yoga Deep Stretch Class"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className={styles.modalFooter}>
              <span>Guide powered by Saku Mind</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
