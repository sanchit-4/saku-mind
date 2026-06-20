import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from './Dashboard.module.css';

// 10+ Activities Database matching Saku Mind theme
const ACTIVITIES_DATABASE = [
  {
    id: 'yin-yoga',
    title: 'Outdoor Yin Yoga',
    category: 'active',
    tagline: 'Get physically active by cleaning up your neighborhood.',
    image: '/e56da35e3af2c1cc2ea11dd001777d144d108219.png',
    how: "Check out a recommended video, 'Yin Yoga Deep Stretch Class' for key postures such as the butterfly, pigeon and dragon. And find yourself a tranquil spot to practice them to achieve true calm and develop inner strength.",
    why: "The continued practice of yoga boosts focus, concentration, better decision making, emotional and impulse control. The practice of yoga is also known to increase increased gray matter density.",
    what: "A unique spin on the common practice of yin yoga. Yin yoga is a slow paced style of yoga that incorporates principles of Chinese medicine. You'll practice balance with asanas (postures) that are held for longer periods of time than in other styles of yoga."
  },
  {
    id: 'kayaking',
    title: 'Kayaking',
    category: 'active',
    tagline: 'Engage with nature by paddling through local waterways.',
    image: '/09be2ee05d900b8fe978af47b10d2b1ef23d0816.png',
    how: 'Rent a kayak at a local dock. Focus on rhythmic paddling strokes and coordinate with your partner to steer smoothly.',
    why: 'Kayaking improves cardiovascular health, builds upper body strength, and reduces stress through calm water immersion.',
    what: 'A water-based paddling sport where you sit facing forward and use a double-bladed paddle to propel yourself.'
  },
  {
    id: 'local-trees',
    title: 'Identifying local trees',
    category: 'learn',
    tagline: 'Notice the flora in your area and learn their names.',
    image: '/91a9bd4d9b0a5a07f812f5473ef6ec98c89f5ba7.png',
    how: 'Take a walk in a local park with a tree guide app. Inspect leaf shapes, bark texture, and seed pods to identify three species.',
    why: 'Learning about nature increases environmental awareness, stimulates cognitive pathways, and promotes mindfulness.',
    what: 'A botanical exploration activity focused on recognizing and naming local native tree species.'
  },
  {
    id: 'walking',
    title: 'Mindful Walking',
    category: 'active',
    tagline: 'Walk slowly and observe the sensations of movement.',
    image: '/b22e67615500c1585e40d2a0c9c0344c249c194b.png',
    how: 'Walk at a steady pace, focusing on the contact of your feet with the ground and breathing in sync with your steps.',
    why: 'Reduces blood pressure, clears the mind, and integrates gentle exercise into a busy workday.',
    what: 'A practice of walking where you remain fully present, observing internal and external environments.'
  },
  {
    id: 'gardening',
    title: 'Gardening',
    category: 'connect',
    tagline: 'Connect with the earth by planting seeds or pulling weeds.',
    image: '/8f71ad1e89b50869c1f052048e0066054db9ecd1.png',
    how: 'Spend 20 minutes potting plants, watering seedlings, or trimming shrubs in a garden bed or window planter.',
    why: 'Working with soil increases serotonin levels, lowers stress hormones, and encourages physical mobility.',
    what: 'The practice of growing and cultivating plants, flowers, or vegetables in soil.'
  },
  {
    id: 'cycling',
    title: 'Scenic Cycling',
    category: 'active',
    tagline: 'Take a bike ride through a local park or trail.',
    image: '/09be2ee05d900b8fe978af47b10d2b1ef23d0816.png',
    how: 'Map out a scenic trail, put on a helmet, and ride at a moderate speed for 30 minutes, taking in the surroundings.',
    why: 'Cycling strengthens legs, improves balance, and triggers endorphin release for improved mood.',
    what: 'A recreational bicycle ride focusing on scenic paths and smooth pedaling.'
  },
  {
    id: 'breathing',
    title: 'Box Breathing',
    category: 'notice',
    tagline: 'Reset your nervous system with simple breath patterns.',
    image: '/e56da35e3af2c1cc2ea11dd001777d144d108219.png',
    how: 'Inhale for 4 seconds, hold for 4, exhale for 4, and hold empty for 4. Repeat for 5-10 cycles in a quiet space.',
    why: 'Calms the amygdala, reduces acute anxiety, and improves focus during stressful workdays.',
    what: 'A breathing technique used by athletes and professionals to regulate stress and regain calm.'
  },
  {
    id: 'journaling',
    title: 'Gratitude Journaling',
    category: 'notice',
    tagline: 'Write down three things you are grateful for today.',
    image: '/91a9bd4d9b0a5a07f812f5473ef6ec98c89f5ba7.png',
    how: 'Find a quiet spot, grab a notebook, and write three specific things that brought you joy or support today.',
    why: 'Shifts cognitive focus from negative stressors to positive resources, increasing long-term happiness.',
    what: 'A written reflection practice dedicated to acknowledging and appreciating positive life elements.'
  },
  {
    id: 'social-chat',
    title: 'Coffee Catch-up',
    category: 'connect',
    tagline: 'Reconnect with a colleague or friend over a warm drink.',
    image: '/b22e67615500c1585e40d2a0c9c0344c249c194b.png',
    how: 'Schedule a 15-minute break with a teammate to talk about non-work interests over coffee or tea.',
    why: 'Strengthens workplace bonds, combats isolation, and fosters collaborative trust.',
    what: 'A short social interaction designed to build relationships and take a healthy break.'
  },
  {
    id: 'stretching',
    title: 'Desk Stretching',
    category: 'active',
    tagline: 'Release tension in your neck, shoulders, and wrists.',
    image: '/8f71ad1e89b50869c1f052048e0066054db9ecd1.png',
    how: 'Perform slow neck rolls, shoulder shrugs, and wrist circles. Stand up and reach for the sky to decompress the spine.',
    why: 'Prevents repetitive strain injury, increases blood flow to muscles, and reduces physical fatigue.',
    what: 'A sequence of simple stretches that can be performed directly at your workspace.'
  }
];

const FIVE_WAYS_ACTIVITIES = [
  {
    id: 'give',
    title: 'Give - Earth',
    text: 'Give and Be Kind to boost happiness and wellbeing. Activities associated with the Earth icon create positive feelings and a sense of self-worth.',
    color: 'green'
  },
  {
    id: 'learn',
    title: 'Keep Learning - Light',
    text: 'Keep Learning for a sense of purpose. Activities associated with the Light icon deepen your understanding of the world.',
    color: 'peach'
  },
  {
    id: 'active',
    title: 'Be Active - Air',
    text: 'Be Active to release endorphins and improve your mood. Activities associated with the air take you outdoors to reconnect with nature after times of isolation indoors.',
    color: 'cyan'
  },
  {
    id: 'connect',
    title: 'Connect - Water',
    text: 'Connect to feel close to and valued by others. Activities associated with the Water icon connect you with others to build a sense of belonging.',
    color: 'blue'
  },
  {
    id: 'notice',
    title: 'Take Notice - Minerals',
    text: 'Take Notice to enhance self-understanding. Activities associated with the Minerals icon develop mindfulness to quieten the mind and enjoy the moment.',
    color: 'pink'
  }
];

const render3DShape = (color, width = 64, height = 64) => {
  if (color === 'green') {
    return (
      <svg viewBox="0 0 100 100" width={width} height={height}>
        <polygon points="50,15 82,32 50,50 18,32" fill="#a3e2c9" stroke="#0d3d44" strokeWidth="2.5" />
        <polygon points="18,32 50,50 50,85 18,67" fill="#5dc0a0" stroke="#0d3d44" strokeWidth="2.5" />
        <polygon points="82,32 50,50 50,85 82,67" fill="#3a8a6c" stroke="#0d3d44" strokeWidth="2.5" />
      </svg>
    );
  }
  if (color === 'peach') {
    return (
      <svg viewBox="0 0 100 100" width={width} height={height}>
        <polygon points="50,15 18,72 50,85" fill="#fca898" stroke="#0d3d44" strokeWidth="2.5" />
        <polygon points="50,15 50,85 82,72" fill="#f26b32" stroke="#0d3d44" strokeWidth="2.5" />
        <polygon points="18,72 50,85 82,72" fill="#a47053" stroke="#0d3d44" strokeWidth="1.5" opacity="0.6" />
      </svg>
    );
  }
  if (color === 'cyan') {
    return (
      <svg viewBox="0 0 100 100" width={width} height={height}>
        <polygon points="50,12 90,32 90,68 50,88 10,68 10,32" fill="#8de2e7" stroke="#0d3d44" strokeWidth="2.5" />
        <polygon points="50,12 50,88 90,68 90,32" fill="#50bec6" opacity="0.9" stroke="#0d3d44" strokeWidth="2.5" />
        <polygon points="50,50 90,32 50,12 10,32" fill="#ffffff" opacity="0.5" stroke="#0d3d44" strokeWidth="2.5" />
        <line x1="50" y1="50" x2="50" y2="88" stroke="#0d3d44" strokeWidth="2.5" />
        <line x1="50" y1="50" x2="90" y2="32" stroke="#0d3d44" strokeWidth="2.5" />
        <line x1="50" y1="50" x2="10" y2="32" stroke="#0d3d44" strokeWidth="2.5" />
      </svg>
    );
  }
  if (color === 'blue') {
    return (
      <svg viewBox="0 0 100 100" width={width} height={height}>
        <polygon points="50,15 78,30 78,65 50,80 22,65 22,30" fill="#a4c2f4" stroke="#0d3d44" strokeWidth="2" />
        <polygon points="50,15 22,30 50,50" fill="#82b3e8" stroke="#0d3d44" strokeWidth="2" />
        <polygon points="50,15 78,30 50,50" fill="#508de6" stroke="#0d3d44" strokeWidth="2" />
        <polygon points="78,30 78,65 50,50" fill="#266ad1" stroke="#0d3d44" strokeWidth="2" />
        <polygon points="78,65 50,80 50,50" fill="#1d4ea8" stroke="#0d3d44" strokeWidth="2" />
        <polygon points="50,80 22,65 50,50" fill="#316eb5" stroke="#0d3d44" strokeWidth="2" />
        <polygon points="22,65 22,30 50,50" fill="#82b3e8" opacity="0.8" stroke="#0d3d44" strokeWidth="2" />
      </svg>
    );
  }
  if (color === 'pink') {
    return (
      <svg viewBox="0 0 100 100" width={width} height={height}>
        <polygon points="50,15 80,45 50,85 20,45" fill="#fca1b0" stroke="#0d3d44" strokeWidth="2.5" />
        <polygon points="50,15 20,45 50,50" fill="#fca3b5" stroke="#0d3d44" strokeWidth="2" />
        <polygon points="50,15 80,45 50,50" fill="#fca1b0" stroke="#0d3d44" strokeWidth="2" />
        <polygon points="50,85 20,45 50,50" fill="#f37d92" stroke="#0d3d44" strokeWidth="2" />
        <polygon points="50,85 80,45 50,50" fill="#c43c56" stroke="#0d3d44" strokeWidth="2" />
      </svg>
    );
  }
  return null;
};

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const Dashboard = () => {
  // Tabs: 'activity', 'journey', 'wellbeing', 'settings'
  const [activeTab, setActiveTab] = useState('activity');
  const [fiveWaysIndex, setFiveWaysIndex] = useState(2); // Default to 'Be Active - Air'

  const [activitiesData, setActivitiesData] = useState(ACTIVITIES_DATABASE);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'activitiestwo'));
        const activitiesList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Unknown Activity',
            category: data.category && data.category.length > 0 ? data.category[0] : 'general',
            tagline: data.subtitle || '',
            image: data.imageurl || '',
            how: data.description?.how || '',
            why: data.description?.why || '',
            what: data.description?.what || '',
            ...data
          };
        });
        
        if (activitiesList.length > 0) {
          setActivitiesData(activitiesList);
        }
      } catch (err) {
        console.error("Error fetching activities from Firebase", err);
      } finally {
        setLoadingActivities(false);
      }
    };
    fetchActivities();
  }, []);

  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const activeActivity = activitiesData[carouselIndex] || activitiesData[0];

  // Favourites state
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem('saku_user_favourites');
      return saved ? JSON.parse(saved) : ['yin-yoga', 'local-trees'];
    } catch (e) {
      return ['yin-yoga', 'local-trees'];
    }
  });

  // Journey state
  const [journeyMode, setJourneyMode] = useState('organisational'); // 'organisational', 'favourites', 'all_ways'
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [orgActivities, setOrgActivities] = useState([]);

  // Modals state
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Settings Tab State
  const [geoToggle, setGeoToggle] = useState(true);
  const [notiToggle, setNotiToggle] = useState(true);

  // Wellbeing Rating Form state
  const [satisfaction, setSatisfaction] = useState(7);
  const [worthwhile, setWorthwhile] = useState(5);
  const [happiness, setHappiness] = useState(4);
  const [anxiety, setAnxiety] = useState(8);

  // Growth / Progress State
  const [recordedCount, setRecordedCount] = useState(() => {
    const saved = localStorage.getItem('saku_user_recorded_count');
    const parsed = saved ? parseInt(saved, 10) : 4;
    return isNaN(parsed) ? 4 : parsed;
  });

  const [successMessage, setSuccessMessage] = useState('');
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Save favourites
  useEffect(() => {
    localStorage.setItem('saku_user_favourites', JSON.stringify(favourites));
  }, [favourites]);

  // Save recorded count
  useEffect(() => {
    localStorage.setItem('saku_user_recorded_count', recordedCount.toString());
  }, [recordedCount]);

  // Load activities for the date / company
  useEffect(() => {
    const company = 'Saku Mind Ltd'; // Default company
    const dbKey = `${company}_${selectedDate}`;
    try {
      const saved = localStorage.getItem('saku_org_activities_by_date');
      if (saved) {
        const db = JSON.parse(saved);
        if (db[dbKey] && db[dbKey].length > 0) {
          setOrgActivities(db[dbKey]);
          return;
        }
      }
    } catch (e) {
      console.error('Error parsing org activities', e);
    }
    // Fallback default activities for organisational list
    setOrgActivities(['yin-yoga', 'kayaking', 'local-trees']);
  }, [selectedDate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const toggleFavourite = (id) => {
    if (favourites.includes(id)) {
      setFavourites(favourites.filter(fav => fav !== id));
    } else {
      setFavourites([...favourites, id]);
    }
  };

  const handleRecordActivityDirect = (id) => {
    setRecordedCount(prev => prev + 1);
    const act = activitiesData.find(a => a.id === id);
    setSuccessMessage(`Success! Completed activity recorded: "${act?.title || ''}"`);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleRecordActiveActivity = () => {
    setRecordedCount(prev => prev + 1);
    setSuccessMessage(`Success! Completed activity recorded: "${activeActivity.title}"`);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleCheckinSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('Wellbeing Check-in recorded! Your averages have been updated.');
    setShowCheckinModal(false);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const navigateToActivity = (id) => {
    const idx = activitiesData.findIndex(a => a.id === id);
    if (idx !== -1) {
      setCarouselIndex(idx);
      setActiveTab('activity');
    }
  };

  // Get active list for the Saku Journey map
  const getJourneyActivities = () => {
    if (journeyMode === 'organisational') {
      return activitiesData.filter(a => orgActivities.includes(a.id));
    } else if (journeyMode === 'favourites') {
      return activitiesData.filter(a => favourites.includes(a.id));
    } else {
      return FIVE_WAYS_ACTIVITIES; // 'all_ways'
    }
  };

  const journeyList = getJourneyActivities();

  // Helper to get carousel offsets
  const getCarouselItems = () => {
    const len = activitiesData.length;
    // We want to show current, -1, -2, +1, +2
    const items = [];
    if (len === 0) return items;
    for (let offset = -2; offset <= 2; offset++) {
      const idx = (carouselIndex + offset + len) % len;
      items.push({
        activity: activitiesData[idx],
        index: idx,
        offset
      });
    }
    return items;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.dashboardGrid}>

        {/* ============================================================== */}
        {/* LEFT NAVIGATION COLUMN                                         */}
        {/* ============================================================== */}
        <div className={styles.leftColumn}>
          <div className={styles.sidebarDarkTealBlock}>
            {/* --- Avatar Cutout Area at the top-left --- */}
            <div className={styles.avatarGemContainer}>
              <img src="/Group.png" alt="Saku Mind Logo" width="160" height="160" style={{ objectFit: 'contain' }} />
            </div>

            {/* --- Sidebar Navigation --- */}
            {activeTab !== 'activity' && (
              <div className={styles.indicatorsStack}>
                <div className={styles.indicatorItem}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={styles.indicatorIcon}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5v-3.5l-10 5-10-5V17zm0-5l10 5 10-5V8.5l-10 5-10-5V12z" />
                  </svg>
                  <span>Level 5</span>
                </div>
                <div className={styles.indicatorItem}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.indicatorIcon}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
                  </svg>
                  <span>Collected {recordedCount}</span>
                </div>
              </div>
            )}

            <nav className={styles.navigation}>
              <ul className={styles.menuList}>
                {activeTab === 'activity' ? (
                  <>
                    <li><button className={styles.menuItem} onClick={() => setActiveTab('journey')}>Saku Journey</button></li>
                    <li><button className={styles.menuItem} onClick={() => setActiveTab('wellbeing')}>Wellbeing Status</button></li>
                    <li><button className={styles.menuItem} onClick={() => setActiveTab('settings')}>Settings</button></li>
                  </>
                ) : activeTab === 'journey' ? (
                  <>
                    <li><button className={styles.menuItem} onClick={() => setActiveTab('wellbeing')}>Wellbeing Status</button></li>
                    <li><button className={styles.menuItem} onClick={() => setActiveTab('settings')}>Settings</button></li>
                  </>
                ) : activeTab === 'wellbeing' ? (
                  <>
                    <li><button className={styles.menuItem} onClick={() => setActiveTab('journey')}>Saku Journey</button></li>
                    <li><button className={styles.menuItem} onClick={() => setActiveTab('settings')}>Settings</button></li>
                  </>
                ) : (
                  <>
                    <li><button className={styles.menuItem} onClick={() => setActiveTab('journey')}>Saku Journey</button></li>
                    <li><button className={styles.menuItem} onClick={() => setActiveTab('wellbeing')}>Wellbeing Status</button></li>
                  </>
                )}
                <li><button onClick={handleLogout} className={styles.menuItem}>Logout</button></li>
              </ul>
            </nav>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT VIEW COLUMN (Header and Workspace)                       */}
        {/* ============================================================== */}
        <div className={styles.rightColumn}>

          {/* --- Top banner text --- */}
          <div className={styles.bannerContent}>
            <div className={styles.bannerText}>
              {activeTab === 'activity' && (
                <>
                  <h1>My Saku Activity</h1>
                  <p>Learn the what, how and why of an activity.  Select guide for step by step activity support. Complete a Saku activity and record how you are feeling to collect an element and help grow your avatar.</p>
                </>
              )}
              {activeTab === 'journey' && (
                <>
                  <h1>My Saku Journey</h1>
                  <p>Complete Saku activities and record how you are feeling to collect elements and grow your avatar. <span className={styles.clickHereLink} onClick={() => setShowHelpModal(true)}>Click here</span> to learn more.</p>
                </>
              )}
              {activeTab === 'wellbeing' && (
                <>
                  <h1>My Wellbeing Status</h1>
                  <p>Track your mood and how activities affect it as well as your overall well-being. The following statistics (30 day) might help you to identify patterns.</p>
                </>
              )}
              {activeTab === 'settings' && (
                <>
                  <h1>Settings</h1>
                  <p>Manage your account settings, notifications, and preferences here.</p>
                </>
              )}
            </div>

            {/* Profile icon in top right */}
            <div 
              className={styles.profileIconContainer} 
              onClick={() => {
                setActiveTab('activity');
                setShowVideoModal(false);
              }}
            >
              <img
                src="/l1.png"
                alt="Profile"
                className={styles.profileImg}
              />
            </div>
          </div>

          {/* --- The complex 'bend left' cut inside the dark teal sidebar --- */}
          <div className={styles.cutInsideCurve}></div>

          {/* Success Toast Notification */}
          {successMessage && (
            <div className={styles.successToast}>
              <div className={styles.toastContent}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" className={styles.checkIcon}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* --- Main content white workspace area --- */}
          <main className={`${styles.mainContent} ${activeTab === 'activity' && showVideoModal ? styles.mainContentVideoMode : ''}`}>

            {/* ========================================================== */}
            {/* ========================================================== */}
            {/* TAB 1: INDIVIDUAL ACTIVITY VIEW                            */}
            {/* ========================================================== */}
            {activeTab === 'activity' && (
              showVideoModal ? (
                <div className={styles.inlineVideoContainer}>
                  <div className={styles.inlineVideoResponsive}>
                    <iframe
                      src={getYoutubeEmbedUrl(activeActivity.button?.externalview?.link) || activeActivity.videourl || "https://www.youtube.com/embed/v7AYKJDqy4U"}
                      title={`${activeActivity.title} Guide`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <button className={styles.capsuleLightBtn} onClick={() => setShowVideoModal(false)}>
                    Close Guide
                  </button>
                </div>
              ) : (
                <div className={styles.activityViewContainer}>
                  <div className={styles.activityTitleBlock}>
                  <h2>{activeActivity.title}</h2>
                  {/* Interactive Heart Icon */}
                  <button
                    className={styles.heartBtn}
                    onClick={() => toggleFavourite(activeActivity.id)}
                    aria-label="Toggle favorite"
                  >
                    {favourites.includes(activeActivity.id) ? (
                      /* Filled heart */
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="#c43c56" stroke="#c43c56" strokeWidth="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      /* Hollow heart */
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0d3d44" strokeWidth="2.5">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    )}
                  </button>
                </div>

                <p className={styles.activityTagline}>{activeActivity.tagline}</p>

                {/* CAROUSEL GRAPHIC CONTROLLER */}
                <div className={styles.carouselContainer}>
                  {getCarouselItems().map((item) => {
                    let itemClass = styles.carouselItemSide;
                    if (item.offset === 0) itemClass = styles.carouselItemCenter;
                    else if (Math.abs(item.offset) === 2) itemClass = `${styles.carouselItemSide} ${styles.carouselItemFar}`;

                    return (
                      <div
                        key={item.activity.id}
                        className={itemClass}
                        onClick={() => setCarouselIndex(item.index)}
                      >
                        <img
                          src={item.activity.image}
                          alt={item.activity.title}
                          className={styles.carouselImg}
                        />
                        {item.offset === 0 && <span className={styles.activeIndicatorDot}></span>}
                      </div>
                    );
                  })}
                </div>

                {/* Carousel navigation dots */}
                <div className={styles.carouselDots}>
                  {activitiesData.map((_, idx) => (
                    <span
                      key={idx}
                      className={`${styles.dot} ${idx === carouselIndex ? styles.dotActive : ''}`}
                      onClick={() => setCarouselIndex(idx)}
                    ></span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className={styles.activityActionButtons}>
                  {activeActivity.button?.externalview && activeActivity.button.externalview.show ? (
                    <button 
                      className={styles.capsuleDarkBtn} 
                      onClick={() => {
                        const ytEmbed = getYoutubeEmbedUrl(activeActivity.button.externalview.link);
                        if (ytEmbed) {
                          setShowVideoModal(true);
                        } else {
                          window.open(activeActivity.button.externalview.link, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      {activeActivity.button.externalview.text || 'View Guide'}
                    </button>
                  ) : (
                    <button className={styles.capsuleDarkBtn} onClick={() => setShowVideoModal(true)}>
                      Video Guide
                    </button>
                  )}
                  <button className={styles.capsuleDarkBtn} onClick={handleRecordActiveActivity}>
                    Record Activity
                  </button>
                </div>

                {/* Description breakdown */}
                <div className={styles.descriptionsGrid}>
                  <div className={styles.descRow}>
                    <strong>How:</strong> <span>{activeActivity.how}</span>
                  </div>
                  <div className={styles.descRow}>
                    <strong>Why:</strong> <span>{activeActivity.why}</span>
                  </div>
                  <div className={styles.descRow}>
                    <strong>What:</strong> <span>{activeActivity.what}</span>
                  </div>
                </div>
              </div>
              )
            )}

            {/* ========================================================== */}
            {/* TAB 2: SAKU JOURNEY VIEW                                   */}
            {/* ========================================================== */}
            {activeTab === 'journey' && (
              <div className={styles.journeyViewContainer}>

                {/* Interactive Selector Dropdown */}
                <div className={styles.dropdownSelectorWrapper}>
                  <div
                    className={styles.dropdownHeaderCapsule}
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className={styles.dropdownTitleLeft}>
                      {/* Custom arrow toggle */}
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className={`${styles.dropdownChevron} ${showDropdown ? styles.chevronOpen : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                      <span>
                        {journeyMode === 'organisational' && 'Organisational Activities'}
                        {journeyMode === 'favourites' && 'Personal Favourites'}
                        {journeyMode === 'all_ways' && 'All 5 Ways Activity'}
                      </span>
                    </div>

                    {/* Interactive Date Select (clicking dates changes it) */}
                    <div className={styles.dropdownDateRight} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className={styles.datePickerInput}
                      />
                    </div>
                  </div>

                  {showDropdown && (
                    <ul className={styles.dropdownMenuList}>
                      <li
                        onClick={() => { setJourneyMode('organisational'); setShowDropdown(false); }}
                        className={journeyMode === 'organisational' ? styles.activeMenuOption : ''}
                      >
                        Organisational Activities
                      </li>
                      <li
                        onClick={() => { setJourneyMode('favourites'); setShowDropdown(false); }}
                        className={journeyMode === 'favourites' ? styles.activeMenuOption : ''}
                      >
                        Personal Favourites
                      </li>
                      <li
                        onClick={() => { setJourneyMode('all_ways'); setShowDropdown(false); }}
                        className={journeyMode === 'all_ways' ? styles.activeMenuOption : ''}
                      >
                        All 5 Ways Activity
                      </li>
                    </ul>
                  )}
                </div>

                {/* MAP DISTRIBUTED ICONS GRID */}
                <div className={styles.activitiesMapWorkspace}>
                  <div className={styles.iconsArchContainer}>
                    {journeyList.map((item, idx) => {
                      // Calculate radial coordinate layout offsets to arrange in an arch
                      const total = journeyList.length;
                      const angleStep = Math.PI / (total + 1);
                      const currentAngle = angleStep * (idx + 1); // angle from left to right

                      // Positioning details for distributed semicircular layout
                      const radiusX = 170; // Horizontal radius of the arch
                      const radiusY = 120; // Vertical radius of the arch
                      const leftOffset = 50 + Math.cos(Math.PI - currentAngle) * 40; // Percentage left
                      const topOffset = 60 - Math.sin(currentAngle) * 45; // Percentage top

                      if (journeyMode === 'all_ways') {
                        return (
                          <div
                            key={item.id}
                            className={`${styles.mapIconNode} ${idx === fiveWaysIndex ? styles.mapNodeActive : ''}`}
                            style={{ left: `${leftOffset}%`, top: `${topOffset}%` }}
                            onClick={() => setFiveWaysIndex(idx)}
                          >
                            <span className={styles.mapNodeTitle}>{item.title}</span>
                            <div className={styles.mapNodeCircleShape}>
                              {render3DShape(item.color, 54, 54)}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={item.id}
                          className={styles.mapIconNode}
                          style={{ left: `${leftOffset}%`, top: `${topOffset}%` }}
                        >
                          {/* Title with heart favorites toggle button next to it */}
                          <div className={styles.mapNodeTitleRow}>
                            <span className={styles.mapNodeTitle}>{item.title}</span>
                            <button
                              className={styles.mapNodeHeartBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavourite(item.id);
                              }}
                              aria-label="Toggle favorite"
                            >
                              {favourites.includes(item.id) ? (
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="#c43c56" stroke="#c43c56">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#0d3d44" strokeWidth="2.5">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              )}
                            </button>
                          </div>

                          <div className={styles.mapNodeCircleImg} onClick={() => navigateToActivity(item.id)}>
                            <img src={item.image} alt={item.title} className={styles.nodeImg} />
                          </div>

                          {/* Fast record activity target button below icon */}
                          <button
                            className={styles.recordTargetBtn}
                            onClick={() => handleRecordActivityDirect(item.id)}
                            aria-label={`Record ${item.title}`}
                          >
                            <span className={styles.targetInnerDot}></span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {journeyMode === 'all_ways' ? (
                    <div className={styles.fiveWaysDetailCard}>
                      <div className={styles.cardHeaderRow}>
                        <div className={styles.cardHeaderTitle}>
                          <h3>{FIVE_WAYS_ACTIVITIES[fiveWaysIndex].title}</h3>
                        </div>
                        <div className={styles.cardHeaderIcon}>
                          {render3DShape(FIVE_WAYS_ACTIVITIES[fiveWaysIndex].color, 44, 44)}
                        </div>
                      </div>
                      <p className={styles.cardBodyText}>
                        {FIVE_WAYS_ACTIVITIES[fiveWaysIndex].text}
                      </p>

                      {/* 5 Dots Navigation inside the card */}
                      <div className={styles.cardDotsNavigation}>
                        {FIVE_WAYS_ACTIVITIES.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`${styles.cardNavDot} ${dotIdx === fiveWaysIndex ? styles.cardNavDotActive : ''}`}
                            onClick={() => setFiveWaysIndex(dotIdx)}
                          ></span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Translucent Stage dome graphic at center bottom */
                    <div className={styles.translucentDomeGlow}></div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 3: WELLBEING STATUS VIEW                               */}
            {/* ========================================================== */}
            {activeTab === 'wellbeing' && (
              <div className={styles.wellbeingViewContainer}>

                {/* Grid of four custom indicator squircle cards */}
                <div className={styles.wellbeingCardsGrid}>

                  {/* Card 1: Wellbeing Activities */}
                  <div className={styles.statSquircleCard}>
                    <span className={styles.statCardTitle}>Wellbeing activities</span>
                    <div className={styles.activitiesIconWrapper}>
                      <div className={styles.statCapsulesGroup}>
                        <span className={`${styles.statPill} ${styles.pillPeach}`}></span>
                        <span className={`${styles.statPill} ${styles.pillTeal}`}></span>
                        <span className={`${styles.statPill} ${styles.pillBlue}`}></span>
                      </div>
                      <span className={styles.statCardCounterBubble}>10</span>
                    </div>
                  </div>

                  {/* Card 2: Habit Building */}
                  <div className={styles.statSquircleCard}>
                    <span className={styles.statCardTitle}>Habit building</span>
                    <div className={styles.activitiesIconWrapper}>
                      <div className={styles.sunMedalGraphic}>
                        <div className={styles.medalCircle}>
                          <div className={styles.medalStarGrid}>
                            <span>✦</span><span>✦</span>
                          </div>
                          <span className={styles.medalRibbonText}>Be active</span>
                        </div>
                        <div className={styles.ribbonTailLeft}></div>
                        <div className={styles.ribbonTailRight}></div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Smiles this month */}
                  <div className={styles.statSquircleCard}>
                    <span className={styles.statCardTitle}>Smiles this month</span>
                    <div className={styles.activitiesIconWrapper}>
                      <div className={styles.smileFaceIcon}>
                        <div className={styles.smileEyes}>
                          <span>^</span><span>^</span>
                        </div>
                        <div className={styles.smileMouth}></div>
                      </div>
                      <span className={`${styles.statCardCounterBubble} ${styles.counterOrange}`}>+5</span>
                    </div>
                  </div>

                  {/* Card 4: Environmental Impact */}
                  <div className={styles.statSquircleCard}>
                    <span className={styles.statCardTitle}>Environmental impact</span>
                    <div className={styles.activitiesIconWrapper}>
                      <div className={styles.ecoImpactSprout}>
                        <circle cx="25" cy="25" r="22" className={styles.ecoRing} />
                        <path d="M25 40 L25 15 M25 22 Q15 15 25 15 Q35 15 25 22" fill="#5dc0a0" stroke="#3a8a6c" strokeWidth="1.5" />
                      </div>
                      <span className={`${styles.statCardCounterBubble} ${styles.counterGreen}`}>+9</span>
                    </div>
                  </div>

                </div>

                {/* Wellbeing Check-in 30 day average statistics */}
                <div className={styles.averagesSection}>
                  <h3 className={styles.averagesTitle}>Wellbeing Check-in, 30 day average</h3>

                  <div className={styles.progressStack}>
                    <div className={styles.progressRow}>
                      <span className={styles.barLabel}>Satisfaction</span>
                      <div className={styles.barTrack}>
                        <div className={`${styles.barFill} ${styles.fillPink}`} style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    <div className={styles.progressRow}>
                      <span className={styles.barLabel}>Worthwhile</span>
                      <div className={styles.barTrack}>
                        <div className={`${styles.barFill} ${styles.fillTeal}`} style={{ width: '50%' }}></div>
                      </div>
                    </div>

                    <div className={styles.progressRow}>
                      <span className={styles.barLabel}>Happiness</span>
                      <div className={styles.barTrack}>
                        <div className={`${styles.barFill} ${styles.fillOrange}`} style={{ width: '40%' }}></div>
                      </div>
                    </div>

                    <div className={styles.progressRow}>
                      <span className={styles.barLabel}>Anxiety</span>
                      <div className={styles.barTrack}>
                        <div className={`${styles.barFill} ${styles.fillGreen}`} style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update Check-in Modal button */}
                <div className={styles.wellbeingActionContainer}>
                  <button
                    className={styles.capsuleDarkBtn}
                    onClick={() => setShowCheckinModal(true)}
                  >
                    Update check-in
                  </button>
                </div>

              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 4: SETTINGS VIEW                                       */}
            {/* ========================================================== */}
            {activeTab === 'settings' && (
              <div className={styles.settingsViewContainer}>
                <div className={styles.settingsDividerList}>

                  {/* Row 1: Email */}
                  <div className={styles.settingsRow}>
                    <span className={styles.settingLabelText}>
                      Email: {currentUser?.email || 'Alex.bloom@saku.com'}
                    </span>
                  </div>

                  {/* Row 2: Geolocation toggle */}
                  <div className={styles.settingsRow}>
                    <span className={styles.settingLabelText}>Geolocation</span>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={geoToggle}
                        onChange={(e) => setGeoToggle(e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  {/* Row 3: Notifications toggle */}
                  <div className={styles.settingsRow}>
                    <span className={styles.settingLabelText}>Notifications</span>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notiToggle}
                        onChange={(e) => setNotiToggle(e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  {/* Row 4: Reset password link */}
                  <div className={styles.settingsRow} onClick={() => setSuccessMessage('Reset password link dispatched to email')}>
                    <span className={styles.settingLabelText}>Reset password</span>
                    <svg className={styles.settingChevron} viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>

                  {/* Row 5: Delete account link */}
                  <div className={styles.settingsRow} onClick={() => setSuccessMessage('Delete account request registered')}>
                    <span className={styles.settingLabelText}>Delete account</span>
                    <svg className={styles.settingChevron} viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>

                  {/* Row 6: Feedback & Support link */}
                  <div className={styles.settingsRow} onClick={() => setSuccessMessage('Support console opened')}>
                    <span className={styles.settingLabelText}>Feedback & Support</span>
                    <svg className={styles.settingChevron} viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>

                  {/* Row 7: Terms and Privacy Policy link */}
                  <div className={styles.settingsRow} onClick={() => setSuccessMessage('Terms of service loaded')}>
                    <span className={styles.settingLabelText}>Terms and Privacy Policy</span>
                    <svg className={styles.settingChevron} viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>

                </div>
              </div>
            )}

          </main>
        </div> {/* end rightColumn */}
      </div> {/* end dashboardGrid */}

      {/* ============================================================== */}
      {/* MODAL 1: HELP DIALOG OVERLAY (Saku Journey Guide)              */}
      {/* ============================================================== */}
      {showHelpModal && (
        <div className={styles.modalOverlay} onClick={() => setShowHelpModal(false)}>
          <div className={styles.helpModalContent} onClick={e => e.stopPropagation()}>
            <button
              className={styles.closeModalCrossBtn}
              onClick={() => setShowHelpModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className={styles.modalHeading}>Saku Journey Guide</h4>
            <p className={styles.modalBodyText}>
              This pop up explains how to navigate through the various activity pages.
            </p>
            <ul className={styles.guideBulletList}>
              <li>Use the drop down menu at the top to filter between **Organisational Activities**, **Personal Favourites**, and **All 5 Ways Activity**.</li>
              <li>Filter different days using the date selector at the right side of the dropdown bar.</li>
              <li>Click on any circular activity node to open its full details, where you can watch video guides and read what/why/how descriptions.</li>
              <li>To quickly record a completed activity, press the small target button (⊙) directly below the activity icon.</li>
            </ul>
            <button className={styles.modalCloseCapsuleBtn} onClick={() => setShowHelpModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: RATINGS CHECK-IN DIALOG OVERLAY (Wellbeing check-in)   */}
      {/* ============================================================== */}
      {showCheckinModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCheckinModal(false)}>
          <div className={styles.ratingModalContent} onClick={e => e.stopPropagation()}>
            <button
              className={styles.closeModalCrossBtn}
              onClick={() => setShowCheckinModal(false)}
              aria-label="Close"
            >
              &times;
            </button>

            <h3 className={styles.wellbeingModalHeading}>My Wellbeing Status</h3>
            <p className={styles.wellbeingModalSubtext}>
              Track your mood and how activities affect it as well as your overall well-being. The following statistics (30 day) might help you to identify patterns.
            </p>

            <form onSubmit={handleCheckinSubmit} className={styles.checkinForm}>
              {/* Question 1: Satisfaction (Pink Theme) */}
              <div className={styles.ratingQuestionRow}>
                <p className={styles.questionText}>Overall, how satisfied are you with your life nowadays?</p>
                <div className={styles.ratingRangeWrapper}>
                  {[...Array(11).keys()].map((val) => (
                    <label key={val} className={`${styles.ratingNodeLabel} ${styles.pinkThemeNode}`}>
                      <input
                        type="radio"
                        name="satisfaction"
                        value={val}
                        checked={satisfaction === val}
                        onChange={() => setSatisfaction(val)}
                        className={styles.ratingRadioInput}
                      />
                      <span className={styles.ratingCircleCircle}>{val}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.rangeLabelsRow}>
                  <span>Not at all</span>
                  <span>Completely</span>
                </div>
              </div>

              {/* Question 2: Worthwhile (Teal Theme) */}
              <div className={styles.ratingQuestionRow}>
                <p className={styles.questionText}>Overall, to what extent do you feel that the things you do in your life are worthwhile?</p>
                <div className={styles.ratingRangeWrapper}>
                  {[...Array(11).keys()].map((val) => (
                    <label key={val} className={`${styles.ratingNodeLabel} ${styles.tealThemeNode}`}>
                      <input
                        type="radio"
                        name="worthwhile"
                        value={val}
                        checked={worthwhile === val}
                        onChange={() => setWorthwhile(val)}
                        className={styles.ratingRadioInput}
                      />
                      <span className={styles.ratingCircleCircle}>{val}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.rangeLabelsRow}>
                  <span>Not at all</span>
                  <span>Completely</span>
                </div>
              </div>

              {/* Question 3: Happiness (Orange Theme) */}
              <div className={styles.ratingQuestionRow}>
                <p className={styles.questionText}>Overall, how happy did you feel yesterday?</p>
                <div className={styles.ratingRangeWrapper}>
                  {[...Array(11).keys()].map((val) => (
                    <label key={val} className={`${styles.ratingNodeLabel} ${styles.orangeThemeNode}`}>
                      <input
                        type="radio"
                        name="happiness"
                        value={val}
                        checked={happiness === val}
                        onChange={() => setHappiness(val)}
                        className={styles.ratingRadioInput}
                      />
                      <span className={styles.ratingCircleCircle}>{val}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.rangeLabelsRow}>
                  <span>Not at all</span>
                  <span>Completely</span>
                </div>
              </div>

              {/* Question 4: Anxiety (Green Theme) */}
              <div className={styles.ratingQuestionRow}>
                <p className={styles.questionText}>Overall, how anxious did you feel yesterday?</p>
                <div className={styles.ratingRangeWrapper}>
                  {[...Array(11).keys()].map((val) => (
                    <label key={val} className={`${styles.ratingNodeLabel} ${styles.greenThemeNode}`}>
                      <input
                        type="radio"
                        name="anxiety"
                        value={val}
                        checked={anxiety === val}
                        onChange={() => setAnxiety(val)}
                        className={styles.ratingRadioInput}
                      />
                      <span className={styles.ratingCircleCircle}>{val}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.rangeLabelsRow}>
                  <span>Not at all</span>
                  <span>Completely</span>
                </div>
              </div>

              <button type="submit" className={styles.modalSubmitGreyBtn}>
                Check-in
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
