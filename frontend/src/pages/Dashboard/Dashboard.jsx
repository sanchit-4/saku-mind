import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
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

// Ordered left-to-right to match the arch layout in the design
const FIVE_WAYS_ACTIVITIES = [
  {
    id: 'active',
    title: 'Be Active - Air',
    name: 'Be Active',
    element: 'Air',
    image: '/be_active1.png',
    text: 'Be Active to release endorphins and improve your mood. Activities associated with the air take you outdoors to reconnect with nature after times of isolation indoors.',
    color: 'cyan'
  },
  {
    id: 'learn',
    title: 'Keep Learning - Light',
    name: 'Keep Learning',
    element: 'Light',
    image: '/keep_learning.png',
    text: 'Keep Learning for a sense of purpose. Activities associated with the Light icon deepen your understanding of the world.',
    color: 'peach'
  },
  {
    id: 'give',
    title: 'Give - Earth',
    name: 'Give',
    element: 'Earth',
    image: '/give.png',
    text: 'Give and Be Kind to boost happiness and wellbeing. Activities associated with the Earth icon create positive feelings and a sense of self-worth.',
    color: 'green'
  },
  {
    id: 'connect',
    title: 'Connect - Water',
    name: 'Connect',
    element: 'Water',
    image: '/connect.png',
    text: 'Connect to feel close to and valued by others. Activities associated with the Water icon connect you with others to build a sense of belonging.',
    color: 'blue'
  },
  {
    id: 'notice',
    title: 'Take Notice - Minerals',
    name: 'Take Notice',
    element: 'Minerals',
    image: '/take_notice.png',
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

// The 5 categories that must each be completed to grow one full tree
const TREE_CATEGORIES = ['active', 'learn', 'give', 'connect', 'notice'];

// Maps each category id → its badge folder under public/frames
const HABIT_BADGE_FOLDERS = {
  active: 'be_Active',
  learn: 'keep_learning',
  give: 'give',
  connect: 'connect',
  notice: 'take_notice',
};

// Badge tiers and the number of completed activities each requires to unlock
const HABIT_TIERS = [
  { key: 'bronze', label: 'Bronze', threshold: 1 },
  { key: 'silver', label: 'Silver', threshold: 5 },
  { key: 'gold', label: 'Gold', threshold: 10 },
];

// Maps a mood to its public/ image folder + filename prefix
const MOOD_FOLDERS = {
  happy: { folder: 'happy_mood', prefix: 'happy' },
  neutral: { folder: 'neutral', prefix: 'neutral' },
  bad: { folder: 'bad_mood', prefix: 'bad' },
};

// Builds the avatar tree image path for a given mood + level (0-5)
const treeImageSrc = (mood, level) => {
  const cfg = MOOD_FOLDERS[mood] || MOOD_FOLDERS.neutral;
  const lvl = Math.max(0, Math.min(5, level || 0));
  return `/${cfg.folder}/${cfg.prefix}_level_${lvl}.png`;
};

const Dashboard = () => {
  // Tabs: 'activity', 'journey', 'wellbeing', 'settings'
  const [activeTab, setActiveTabRaw] = useState('journey');
  const [previousTab, setPreviousTab] = useState(null);
  const setActiveTab = (tab) => {
    setPreviousTab(activeTab);
    setActiveTabRaw(tab);
    // Clear notifications and close modals when switching tabs
    setSuccessMessage('');
    setShowCompletionModal(false);
    setShowVideoModal(false);
    setShowCheckinModal(false);
    setShowHelpModal(false);
    setCongrats(null);
    setCompletedActivityData(null);
  };
  const [fiveWaysIndex, setFiveWaysIndex] = useState(null); // null = no card shown (clean default)
  const [hoveredFiveWaysIndex, setHoveredFiveWaysIndex] = useState(null);
  const [habitIndex, setHabitIndex] = useState(0); // which category badge slide is shown

  const [activitiesData, setActivitiesData] = useState(ACTIVITIES_DATABASE);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Maps Firebase category strings → internal filter IDs used by FIVE_WAYS_ACTIVITIES
  const CATEGORY_NAME_MAP = {
    'active': 'active',
    'be active': 'active',
    'be_active': 'active',
    'learn': 'learn',
    'keep learning': 'learn',
    'keep_learning': 'learn',
    'give': 'give',
    'connect': 'connect',
    'notice': 'notice',
    'take notice': 'notice',
    'take_notice': 'notice',
  };

  const normalizeCategory = (raw) => {
    if (!raw) return 'general';
    const lower = String(raw).trim().toLowerCase();
    return CATEGORY_NAME_MAP[lower] || lower;
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'activitiestwo'));
        const activitiesList = querySnapshot.docs.map(doc => {
          const data = doc.data();

          // Debug: log raw category values from Firebase
          console.log(`[Firebase] Activity "${data.title}" — raw category:`, data.category);

          // Normalise category: Firebase may store an array or a string
          let normCategory = 'general';
          if (Array.isArray(data.category) && data.category.length > 0) {
            normCategory = normalizeCategory(data.category[0]);
          } else if (typeof data.category === 'string') {
            normCategory = normalizeCategory(data.category);
          }

          return {
            ...data,            // spread raw data first
            id: doc.id,         // then override with our normalised fields
            title: data.title || 'Unknown Activity',
            category: normCategory,
            tagline: data.subtitle || '',
            image: data.imageurl || '',
            how: data.description?.how || '',
            why: data.description?.why || '',
            what: data.description?.what || '',
            activityPoints: data.point?.points || data.points || 0,
          };
        });
        
        console.log('[Firebase] All normalised categories:', activitiesList.map(a => `${a.title}: ${a.category}`));

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

  // Category filter state (null = show all, string = filter by category id)
  const [categoryFilter, setCategoryFilter] = useState(null);

  // Filtered activities based on selected category
  const filteredActivities = categoryFilter
    ? activitiesData.filter(a => {
        // Handle both array and string category formats from Firebase
        if (Array.isArray(a.category)) {
          return a.category.includes(categoryFilter);
        }
        return a.category === categoryFilter;
      })
    : activitiesData;

  // Human-readable label for the active filter
  const filterLabel = categoryFilter
    ? (FIVE_WAYS_ACTIVITIES.find(fw => fw.id === categoryFilter)?.name || categoryFilter)
    : null;

  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const activeActivity = filteredActivities[carouselIndex] || filteredActivities[0];

  // Favourites state (hydrated from Firestore on load)
  const [favourites, setFavourites] = useState(['yin-yoga', 'local-trees']);

  // Journey state
  const [journeyMode, setJourneyMode] = useState('organisational'); // 'organisational', 'favourites', 'all_ways'
  const [sourceJourneyMode, setSourceJourneyMode] = useState(null); // tracks which mode launched the activity carousel
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [orgActivities, setOrgActivities] = useState([]);
  const [loadingOrg, setLoadingOrg] = useState(true); // true until first org fetch completes

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

  // Growth / Progress State (hydrated from Firestore on load)
  const [recordedCount, setRecordedCount] = useState(0);

  // Wellbeing Score — accumulated points from completed activities
  const [wellbeingScore, setWellbeingScore] = useState(0);

  const [successMessage, setSuccessMessage] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedActivityData, setCompletedActivityData] = useState(null);
  // null = show the mood picker; object = show the congratulations screen
  const [congrats, setCongrats] = useState(null);
  const { logout, currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  // ── Tree growth state ──────────────────────────────────────────────
  // completedCategories = distinct categories done in the CURRENT cycle (0-5)
  // treeMood = latest activity mood (decides which tree variant shows)
  // treesGrown = number of fully-grown trees collected so far
  const [completedCategories, setCompletedCategories] = useState([]);
  const [treeMood, setTreeMood] = useState('neutral');
  const [treesGrown, setTreesGrown] = useState(0);

  // Log of recorded activities: [{ ts, mood }] — used for 30-day wellbeing stats
  const [activityLog, setActivityLog] = useState([]);

  // Log of wellbeing check-ins: [{ ts, satisfaction, worthwhile, happiness, anxiety }]
  const [checkinLog, setCheckinLog] = useState([]);

  // True once the user's data has been hydrated from Firestore (guards saves)
  const [dataLoaded, setDataLoaded] = useState(false);

  const treeLevel = completedCategories.length; // 0-5 categories completed
  const treeAvatarSrc = treeImageSrc(treeMood, treeLevel);

  // 30-day rolling wellbeing stats
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const recentRecords = activityLog.filter((r) => Date.now() - (r.ts || 0) <= THIRTY_DAYS_MS);
  const activitiesLast30 = recentRecords.length;
  const smilesLast30 = recentRecords.filter((r) => r.mood === 'happy').length;

  // Lifetime completions per category (drives which habit badges are unlocked)
  const categoryCounts = activityLog.reduce((acc, r) => {
    if (r.cat) acc[r.cat] = (acc[r.cat] || 0) + 1;
    return acc;
  }, {});

  // 30-day average of each wellbeing check-in metric (0-10) → bar % width
  const recentCheckins = checkinLog.filter((c) => Date.now() - (c.ts || 0) <= THIRTY_DAYS_MS);
  const checkinAvg = (key) =>
    recentCheckins.length
      ? recentCheckins.reduce((sum, c) => sum + (c[key] || 0), 0) / recentCheckins.length
      : 0;
  const avgBarPct = (key) => `${Math.round((checkinAvg(key) / 10) * 100)}%`;

  // Hydrate ALL user data from Firestore once the user is known
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.treeProgress) {
            const tp = data.treeProgress;
            setCompletedCategories(Array.isArray(tp.completedCategories) ? tp.completedCategories : []);
            setTreeMood(tp.mood || 'neutral');
            setTreesGrown(tp.treesGrown || 0);
          }
          if (Array.isArray(data.activityLog)) setActivityLog(data.activityLog);
          if (Array.isArray(data.checkinLog)) setCheckinLog(data.checkinLog);
          if (Array.isArray(data.favourites)) setFavourites(data.favourites);
          if (typeof data.wellbeingScore === 'number') setWellbeingScore(data.wellbeingScore);
          if (typeof data.recordedCount === 'number') setRecordedCount(data.recordedCount);
          if (typeof data.geoToggle === 'boolean') setGeoToggle(data.geoToggle);
          if (typeof data.notiToggle === 'boolean') setNotiToggle(data.notiToggle);
        }
      } catch (e) {
        console.error('Failed to load user data', e);
      } finally {
        setDataLoaded(true);
      }
    })();
  }, [currentUser]);

  // Persist tree progress + activity log to Firestore
  const persistTreeProgress = (cats, mood, grown, log) => {
    if (!currentUser) return;
    const data = {
      treeProgress: { completedCategories: cats, mood, level: cats.length, treesGrown: grown, updatedAt: Date.now() },
    };
    if (log) data.activityLog = log;
    setDoc(doc(db, 'users', currentUser.uid), data, { merge: true })
      .catch((e) => console.error('Failed to save tree progress', e));
  };

  // Save favourites to Firestore (only after initial hydrate, to avoid clobbering)
  useEffect(() => {
    if (!dataLoaded || !currentUser) return;
    setDoc(doc(db, 'users', currentUser.uid), { favourites }, { merge: true })
      .catch((e) => console.error('Failed to save favourites', e));
  }, [favourites, dataLoaded, currentUser]);

  // Save recorded count to Firestore
  useEffect(() => {
    if (!dataLoaded || !currentUser) return;
    setDoc(doc(db, 'users', currentUser.uid), { recordedCount }, { merge: true })
      .catch((e) => console.error('Failed to save recorded count', e));
  }, [recordedCount, dataLoaded, currentUser]);

  // Save settings toggles to Firestore
  useEffect(() => {
    if (!dataLoaded || !currentUser) return;
    setDoc(doc(db, 'users', currentUser.uid), { geoToggle, notiToggle }, { merge: true })
      .catch((e) => console.error('Failed to save settings', e));
  }, [geoToggle, notiToggle, dataLoaded, currentUser]);

  // Organisational activities for the user's company + selected date.
  // Read from Firestore orgActivities/{companyCode}_{date}; the Admin panel
  // writes the ordered list of activity ids for each company/date.
  useEffect(() => {
    setLoadingOrg(true);
    const companyCode = userProfile?.companyCode;
    if (!companyCode) {
      setOrgActivities([]);
      setLoadingOrg(false);
      return;
    }
    const fetchOrg = async () => {
      const docKey = `${companyCode}_${selectedDate}`;
      try {
        const snap = await getDoc(doc(db, 'orgActivities', docKey));
        if (snap.exists() && Array.isArray(snap.data().activities)) {
          setOrgActivities(snap.data().activities);
        } else {
          setOrgActivities([]);
        }
      } catch (err) {
        console.error('Failed to load organisational activities', err);
        setOrgActivities([]);
      } finally {
        setLoadingOrg(false);
      }
    };
    fetchOrg();
  }, [selectedDate, userProfile?.companyCode]);

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
    const act = activitiesData.find(a => a.id === id);
    setCompletedActivityData(act || null);
    setCongrats(null);
    setShowCompletionModal(true);
  };

  const handleRecordActiveActivity = () => {
    setCompletedActivityData(activeActivity);
    setCongrats(null);
    setShowCompletionModal(true);
  };

  const handleMoodSelect = (mood) => {
    // Normalise to image folder keys: happy | neutral | bad
    const moodKey = mood === 'sad' ? 'bad' : mood;

    // Which of the 5 categories does the completed activity belong to?
    const catInfo = getCategoryInfo(completedActivityData);
    const catId = catInfo && TREE_CATEGORIES.includes(catInfo.id) ? catInfo.id : null;

    // Start a fresh cycle if the previous tree was already complete
    let cats = completedCategories.length >= 5 ? [] : [...completedCategories];
    if (catId && !cats.includes(catId)) cats.push(catId);

    let grown = treesGrown;
    let info;
    // Calculate earned points early so we can include in congrats
    const earnedPoints = completedActivityData?.activityPoints || completedActivityData?.point?.points || completedActivityData?.points || 0;
    if (cats.length >= 5) {
      // All 5 categories done → grow a tree, then reset the level to zero.
      // Show the full grown tree + a fresh seed.
      grown = treesGrown + 1;
      info = {
        complete: true,
        grownImg: treeImageSrc(moodKey, 5),
        seedImg: treeImageSrc(moodKey, 0),
        earnedPoints,
      };
      cats = [];
    } else {
      // Grew by a level → show the new level's tree
      info = { complete: false, grownImg: treeImageSrc(moodKey, cats.length), earnedPoints };
    }

    const now = Date.now();
    const record = {
      ts: now,
      mood: moodKey,
      cat: catId,
      activityId: completedActivityData?.id || '',
      activityTitle: completedActivityData?.title || '',
      points: earnedPoints,
    };
    const newLog = [...activityLog, record];

    // Analytics-friendly record — one Firestore doc per completed activity,
    // so the client can slice/dice by activityId, category, points & date.
    if (currentUser && completedActivityData?.id) {
      addDoc(collection(db, 'activityRecords'), {
        userId: currentUser.uid,
        activityId: completedActivityData.id,
        activityTitle: completedActivityData.title || '',
        category: catId,
        mood: moodKey,
        points: earnedPoints,
        companyCode: userProfile?.companyCode || '',
        companyName: userProfile?.companyName || '',
        timestamp: now,
      }).catch((e) => console.error('Failed to save activity record', e));
    }

    // Add activity points to the wellbeing score
    const newScore = wellbeingScore + earnedPoints;
    setWellbeingScore(newScore);
    if (currentUser && earnedPoints > 0) {
      setDoc(doc(db, 'users', currentUser.uid), { wellbeingScore: newScore }, { merge: true })
        .catch((e) => console.error('Failed to save wellbeing score', e));
    }

    setRecordedCount(prev => prev + 1);
    setTreeMood(moodKey);
    setCompletedCategories(cats);
    setTreesGrown(grown);
    setActivityLog(newLog);
    persistTreeProgress(cats, moodKey, grown, newLog);

    setCongrats(info); // switch the panel from mood picker to congratulations
  };

  const handleCloseCompletionModal = () => {
    // Closing cancels/finishes the flow
    setShowCompletionModal(false);
    setCompletedActivityData(null);
    setCongrats(null);
  };

  // Get the Five Ways category info for a given activity
  const getCategoryInfo = (activity) => {
    if (!activity) return null;
    const cat = Array.isArray(activity.category) ? activity.category[0] : activity.category;
    return FIVE_WAYS_ACTIVITIES.find(fw => fw.id === cat) || null;
  };

  const handleCheckinSubmit = (e) => {
    e.preventDefault();
    const entry = { ts: Date.now(), satisfaction, worthwhile, happiness, anxiety };
    const newLog = [...checkinLog, entry];
    setCheckinLog(newLog);
    if (currentUser) {
      setDoc(doc(db, 'users', currentUser.uid), { checkinLog: newLog }, { merge: true })
        .catch((err) => console.error('Failed to save check-in', err));
    }
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
      // Preserve the admin-defined order of the org activity ids
      return orgActivities
        .map(id => activitiesData.find(a => a.id === id))
        .filter(Boolean);
    } else if (journeyMode === 'favourites') {
      return activitiesData.filter(a => favourites.includes(a.id));
    } else {
      return FIVE_WAYS_ACTIVITIES; // 'all_ways'
    }
  };

  const journeyList = getJourneyActivities();

  // Helper to get carousel offsets (uses filteredActivities)
  const getCarouselItems = () => {
    const len = filteredActivities.length;
    // We want to show current, -1, -2, +1, +2
    const items = [];
    if (len === 0) return items;
    for (let offset = -2; offset <= 2; offset++) {
      const idx = (carouselIndex + offset + len) % len;
      items.push({
        activity: filteredActivities[idx],
        index: idx,
        offset
      });
    }
    return items;
  };

  // Navigate to activity tab with a category filter
  // Also saves the current journeyMode so the back arrow can return to the right sub-view
  const navigateToCategory = (categoryId) => {
    setSourceJourneyMode(journeyMode);
    setCategoryFilter(categoryId);
    setCarouselIndex(0);
    setActiveTab('activity');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.dashboardGrid}>

        {/* ============================================================== */}
        {/* LEFT NAVIGATION COLUMN                                         */}
        {/* ============================================================== */}
        <div className={styles.leftColumn}>
          <div className={styles.sidebarDarkTealBlock}>
            {/* --- Avatar / Category Icon at the top-left --- */}
            <div className={styles.avatarGemContainer}>
              <div className={styles.avatarCircle}>
                {activeTab === 'activity' && categoryFilter ? (() => {
                  const cat = FIVE_WAYS_ACTIVITIES.find(fw => fw.id === categoryFilter);
                  return cat ? (
                    <img src={cat.image} alt={cat.name} className={styles.avatarTreeImg} style={{ objectFit: 'contain', padding: '8px' }} />
                  ) : (
                    <img src={treeAvatarSrc} alt={`Tree — ${treeMood}, level ${treeLevel}`} className={styles.avatarTreeImg} />
                  );
                })() : (
                  <img src={treeAvatarSrc} alt={`Tree — ${treeMood}, level ${treeLevel}`} className={styles.avatarTreeImg} />
                )}
              </div>
            </div>

            {/* --- Indicators (always visible) --- */}
            <div className={styles.indicatorsStack}>
              <div className={styles.indicatorItem}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={styles.indicatorIcon}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5v-3.5l-10 5-10-5V17zm0-5l10 5 10-5V8.5l-10 5-10-5V12z" />
                </svg>
                <span>Level {treeLevel}</span>
              </div>
              <div className={styles.indicatorItem}>
                <img src="/avatars/a1.png" alt="Collected" className={styles.collectedThumb} />
                <span>Collected {treesGrown}</span>
              </div>
            </div>

            {/* --- Sidebar Navigation (all options always visible) --- */}
            <nav className={styles.navigation}>
              <ul className={styles.menuList}>
                <li>
                  <button
                    className={`${styles.menuItem} ${activeTab === 'journey' ? styles.active : ''}`}
                    onClick={() => {
                      setJourneyMode('organisational');
                      setCategoryFilter(null);
                      setActiveTab('journey');
                    }}
                  >
                    Saku Journey
                  </button>
                </li>
                <li>
                  <button
                    className={`${styles.menuItem} ${activeTab === 'wellbeing' ? styles.active : ''}`}
                    onClick={() => setActiveTab('wellbeing')}
                  >
                    Wellbeing Status
                  </button>
                </li>
                <li>
                  <button
                    className={`${styles.menuItem} ${activeTab === 'settings' ? styles.active : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </button>
                </li>
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
            {activeTab === 'activity' && previousTab && previousTab !== 'activity' && (
              <button
                className={styles.backBtn}
                onClick={() => {
                  // Restore the journey mode that was active before entering the carousel
                  if (sourceJourneyMode) {
                    setJourneyMode(sourceJourneyMode);
                    setSourceJourneyMode(null);
                  }
                  setCategoryFilter(null);
                  setActiveTabRaw(previousTab);
                  setPreviousTab(null);
                }}
                aria-label="Go back"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}
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

            {/* Profile icon in top right — navigates to home (intercepted by SessionLock) */}
            <a href="/" className={styles.profileIconContainer} aria-label="Go to Saku home">
              <img
                src="/l1.png"
                alt="Profile"
                className={styles.profileImg}
              />
            </a>
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

            {showCompletionModal ? (() => {
              const catInfo = getCategoryInfo(completedActivityData);
              return (
                <div className={styles.completionPanel}>
                  <button
                    className={styles.completionCloseBtn}
                    onClick={handleCloseCompletionModal}
                    aria-label="Close"
                  >
                    &times;
                  </button>

                  {congrats ? (
                    congrats.complete ? (
                      /* Tree fully grown */
                      <>
                        <h2 className={styles.completionTitle}>Congratulations!</h2>
                        <p className={styles.completionText}>
                          Your Saku tree is now fully grown and bearing the fruits of all your wellbeing activities!
                        </p>
                        <div className={styles.completionTreeCircle}>
                          <img src={congrats.grownImg} alt="Fully grown tree" className={styles.completionTreeImg} />
                        </div>
                        <p className={styles.completionMoodPrompt}>
                          Here's a new seed to continue your journey and grow your Saku forest.
                        </p>
                        <div className={styles.completionTreeCircle}>
                          <img src={congrats.seedImg} alt="New seed" className={styles.completionTreeImg} />
                        </div>
                        {congrats.earnedPoints > 0 && (
                          <div className={styles.earnedPointsBadge}>
                            <span className={styles.earnedPointsIcon}>⭐</span>
                            <span>+{congrats.earnedPoints} environmental impact points earned!</span>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Grew by a level */
                      <>
                        <h2 className={styles.completionTitle}>Congratulations!</h2>
                        <p className={styles.completionText}>
                          You have grown your Saku tree by a level!
                        </p>
                        <div className={styles.completionTreeCircle}>
                          <img src={congrats.grownImg} alt="Your growing tree" className={styles.completionTreeImg} />
                        </div>
                        <p className={styles.completionMoodPrompt}>
                          Keep doing activities from each of the 5 ways to reach the next level. Soon you'll add a full grown tree to your Saku forest.
                        </p>
                        {congrats.earnedPoints > 0 && (
                          <div className={styles.earnedPointsBadge}>
                            <span className={styles.earnedPointsIcon}>⭐</span>
                            <span>+{congrats.earnedPoints} environmental impact points earned!</span>
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    /* Mood picker */
                    <>
                      <h2 className={styles.completionTitle}>Well done!</h2>
                      <p className={styles.completionText}>
                        You have finished your activity and gained an element to grow your avatar.
                      </p>

                      {catInfo && (
                        <div className={styles.completionCategoryBadge}>
                          <span className={styles.completionCategoryName}>{catInfo.name}</span>
                          <img src={catInfo.image} alt={catInfo.name} className={styles.completionCategoryImg} />
                          <span className={styles.completionCategoryElement}>{catInfo.element}</span>
                        </div>
                      )}

                      <p className={styles.completionMoodPrompt}>
                        Tell us how the activity made you feel and your avatar will reflect your mood.
                      </p>

                      <div className={styles.completionMoodRow}>
                        <button className={styles.moodBtn} onClick={() => handleMoodSelect('happy')} aria-label="Happy">
                          <img src="/happy.png" alt="Happy" className={styles.moodImg} />
                        </button>
                        <button className={styles.moodBtn} onClick={() => handleMoodSelect('neutral')} aria-label="Neutral">
                          <img src="/neutral.png" alt="Neutral" className={styles.moodImg} />
                        </button>
                        <button className={styles.moodBtn} onClick={() => handleMoodSelect('sad')} aria-label="Sad">
                          <img src="/sad.png" alt="Sad" className={styles.moodImg} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })() : (
            <>

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
              ) : filteredActivities.length === 0 ? (
                <div className={styles.activityViewContainer}>
                  <p style={{ color: '#767676', marginTop: '40px', fontFamily: 'var(--font-secondary)' }}>No activities found in this category yet.</p>
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
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="#154A55" stroke="#154A55" strokeWidth="2">
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
                        onClick={() => {
                          if (Math.abs(item.offset) === 2) {
                            // Only step by 1 in that direction to avoid a visual jump
                            const len = filteredActivities.length;
                            setCarouselIndex((carouselIndex + (item.offset > 0 ? 1 : -1) + len) % len);
                          } else {
                            setCarouselIndex(item.index);
                          }
                        }}
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
                  {filteredActivities.map((_, idx) => (
                    <span
                      key={idx}
                      className={`${styles.dot} ${idx === carouselIndex ? styles.dotActive : ''}`}
                      onClick={() => setCarouselIndex(idx)}
                    ></span>
                  ))}
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
              </div>
              )
            )}

            {/* ========================================================== */}
            {/* TAB 2: SAKU JOURNEY VIEW                                   */}
            {/* ========================================================== */}
            {activeTab === 'journey' && (
              <div className={`${styles.journeyViewContainer} ${journeyMode === 'all_ways' ? styles.journeyAllWays : ''}`}>
                {/* Gate content until activities are loaded from Firestore */}
                {loadingActivities ? (
                  <div className={styles.journeyLoadingState}>
                    <div className={styles.journeyLoadingDot}></div>
                    <div className={styles.journeyLoadingDot}></div>
                    <div className={styles.journeyLoadingDot}></div>
                  </div>
                ) : (<>

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
                        {journeyMode === 'all_ways' && 'All 5 Ways Activities'}
                      </span>
                    </div>

                    {/* Interactive Date Select (clicking dates changes it) — not needed for All 5 Ways */}
                    {journeyMode !== 'all_ways' && (
                      <div className={styles.dropdownDateRight} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className={styles.datePickerInput}
                        />
                      </div>
                    )}
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
                        All 5 Ways Activities
                      </li>
                    </ul>
                  )}
                </div>

                {/* ACTIVITIES DISPLAY */}
                {journeyMode === 'all_ways' ? (
                  /* ---- All 5 Ways: arch layout ---- */
                  <div className={styles.activitiesMapWorkspace}>
                    <div className={styles.iconsArchContainer}>
                      {journeyList.map((item, idx) => {
                        const total = journeyList.length;
                        const angleStep = Math.PI / (total + 1);
                        const currentAngle = angleStep * (idx + 1);
                        const leftOffset = 50 + Math.cos(Math.PI - currentAngle) * 40;
                        const topOffset = 60 - Math.sin(currentAngle) * 45;

                        return (
                          <div
                            key={item.id}
                            className={`${styles.fiveWayNode} ${hoveredFiveWaysIndex === idx ? styles.fiveWayNodeActive : ''}`}
                            style={{ left: `${leftOffset}%`, top: `${topOffset}%`, cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredFiveWaysIndex(idx)}
                            onMouseLeave={() => setHoveredFiveWaysIndex(null)}
                            onClick={() => navigateToCategory(item.id)}
                          >
                            <span className={styles.fiveWayName}>{item.name}</span>
                            <img src={item.image} alt={item.name} className={styles.fiveWaySymbol} />
                            <span className={styles.fiveWayElement}>{item.element}</span>
                          </div>
                        );
                      })}
                    </div>

                    {hoveredFiveWaysIndex !== null && (
                      <div
                        className={styles.fiveWaysDetailCard}
                        onMouseEnter={() => setHoveredFiveWaysIndex(hoveredFiveWaysIndex)}
                        onMouseLeave={() => setHoveredFiveWaysIndex(null)}
                      >
                        <div className={styles.cardHeaderRow}>
                          <div className={styles.cardHeaderTitle}>
                            <h3>{FIVE_WAYS_ACTIVITIES[hoveredFiveWaysIndex].title}</h3>
                          </div>
                          <div className={styles.cardHeaderIcon}>
                            <img
                              src={FIVE_WAYS_ACTIVITIES[hoveredFiveWaysIndex].image}
                              alt={FIVE_WAYS_ACTIVITIES[hoveredFiveWaysIndex].name}
                              className={styles.cardHeaderSymbol}
                            />
                          </div>
                        </div>
                        <p className={styles.cardBodyText}>
                          {FIVE_WAYS_ACTIVITIES[hoveredFiveWaysIndex].text}
                        </p>

                        <div className={styles.cardDotsNavigation}>
                          {FIVE_WAYS_ACTIVITIES.map((_, dotIdx) => (
                            <span
                              key={dotIdx}
                              className={`${styles.cardNavDot} ${dotIdx === hoveredFiveWaysIndex ? styles.cardNavDotActive : ''}`}
                              onMouseEnter={() => setHoveredFiveWaysIndex(dotIdx)}
                            ></span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : journeyMode === 'organisational' ? (
                  /* ---- Organisational: semicircle arch in admin-defined order ---- */
                  <div className={`${styles.activitiesMapWorkspace} ${styles.orgMapWorkspace}`}>
                    {loadingOrg ? (
                      <div className={styles.journeyLoadingState}>
                        <div className={styles.journeyLoadingDot}></div>
                        <div className={styles.journeyLoadingDot}></div>
                        <div className={styles.journeyLoadingDot}></div>
                      </div>
                    ) : journeyList.length === 0 ? (
                      <p className={styles.emptyOrgMsg}>
                        No organisational activities have been assigned for this date.
                        Contact your administrator to set up the daily activities.
                      </p>
                    ) : (
                      <div className={styles.iconsArchContainer}>
                        {journeyList.map((item, idx) => {
                          const total = journeyList.length;
                          const angleStep = Math.PI / (total + 1);
                          const currentAngle = angleStep * (idx + 1);
                          const leftOffset = 50 + Math.cos(Math.PI - currentAngle) * 40;
                          const topOffset = 60 - Math.sin(currentAngle) * 45;
                          const catName = FIVE_WAYS_ACTIVITIES.find(fw => fw.id === item.category)?.name || item.category || '';
                          return (
                            <div
                              key={item.id}
                              className={styles.fiveWayNode}
                              style={{ left: `${leftOffset}%`, top: `${topOffset}%`, cursor: 'pointer' }}
                              onClick={() => navigateToActivity(item.id)}
                              title={item.title}
                            >
                              <span className={styles.fiveWayName}>{item.title}</span>
                              {item.image && <img src={item.image} alt={item.title} className={styles.fiveWaySymbol} />}
                              {catName && <span className={styles.fiveWayElement}>{catName}</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* ---- Favourites: clean 2-column grid ---- */
                  <div className={styles.activitiesGridLayout}>
                    {journeyList.length === 0 ? (
                      <p className={styles.emptyGridMsg}>No activities in this list yet.</p>
                    ) : (
                      journeyList.map((item) => (
                        <div key={item.id} className={styles.gridActivityCard}>
                          <div className={styles.gridCardImgWrap} onClick={() => navigateToActivity(item.id)}>
                            <img src={item.image} alt={item.title} className={styles.gridCardImg} />
                          </div>
                          <div className={styles.gridCardInfo}>
                            <span className={styles.gridCardTitle}>{item.title}</span>
                            <div className={styles.gridCardActions}>
                              <button
                                className={styles.mapNodeHeartBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavourite(item.id);
                                }}
                                aria-label="Toggle favorite"
                              >
                                {favourites.includes(item.id) ? (
                                  <svg viewBox="0 0 24 24" width="15" height="15" fill="#154A55" stroke="#154A55">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#0d3d44" strokeWidth="2.5">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                  </svg>
                                )}
                              </button>
                              <button
                                className={styles.gridRecordBtn}
                                onClick={() => handleRecordActivityDirect(item.id)}
                                aria-label={`Record ${item.title}`}
                              >
                                <span className={styles.targetInnerDot}></span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>)}
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 3: WELLBEING STATUS VIEW                               */}
            {/* ========================================================== */}
            {activeTab === 'wellbeing' && (
              showCheckinModal ? (
              <div className={styles.checkinInlineView}>
                <button
                  className={styles.checkinCloseBtn}
                  onClick={() => setShowCheckinModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>

                <form onSubmit={handleCheckinSubmit} className={styles.checkinFormInline}>
                  {/* Q1: Satisfaction (Pink) */}
                  <div className={styles.ratingQuestionRow}>
                    <p className={styles.questionText}>Overall, how satisfied are you with your life nowadays?</p>
                    <div className={styles.ratingRangeWrapper}>
                      {[...Array(11).keys()].map((val) => (
                        <label key={val} className={`${styles.ratingNodeLabel} ${styles.pinkThemeNode}`}>
                          <input type="radio" name="satisfaction" value={val} checked={satisfaction === val} onChange={() => setSatisfaction(val)} className={styles.ratingRadioInput} />
                          <span className={styles.ratingCircleCircle}>{val}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.rangeLabelsRow}><span>Not at all</span><span>Completely</span></div>
                  </div>

                  {/* Q2: Worthwhile (Teal) */}
                  <div className={styles.ratingQuestionRow}>
                    <p className={styles.questionText}>Overall, to what extent do you feel that the things you do in your life are worthwhile?</p>
                    <div className={styles.ratingRangeWrapper}>
                      {[...Array(11).keys()].map((val) => (
                        <label key={val} className={`${styles.ratingNodeLabel} ${styles.tealThemeNode}`}>
                          <input type="radio" name="worthwhile" value={val} checked={worthwhile === val} onChange={() => setWorthwhile(val)} className={styles.ratingRadioInput} />
                          <span className={styles.ratingCircleCircle}>{val}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.rangeLabelsRow}><span>Not at all</span><span>Completely</span></div>
                  </div>

                  {/* Q3: Happiness (Orange) */}
                  <div className={styles.ratingQuestionRow}>
                    <p className={styles.questionText}>Overall, how happy did you feel yesterday?</p>
                    <div className={styles.ratingRangeWrapper}>
                      {[...Array(11).keys()].map((val) => (
                        <label key={val} className={`${styles.ratingNodeLabel} ${styles.orangeThemeNode}`}>
                          <input type="radio" name="happiness" value={val} checked={happiness === val} onChange={() => setHappiness(val)} className={styles.ratingRadioInput} />
                          <span className={styles.ratingCircleCircle}>{val}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.rangeLabelsRow}><span>Not at all</span><span>Completely</span></div>
                  </div>

                  {/* Q4: Anxiety (Green) */}
                  <div className={styles.ratingQuestionRow}>
                    <p className={styles.questionText}>Overall, how anxious did you feel yesterday?</p>
                    <div className={styles.ratingRangeWrapper}>
                      {[...Array(11).keys()].map((val) => (
                        <label key={val} className={`${styles.ratingNodeLabel} ${styles.greenThemeNode}`}>
                          <input type="radio" name="anxiety" value={val} checked={anxiety === val} onChange={() => setAnxiety(val)} className={styles.ratingRadioInput} />
                          <span className={styles.ratingCircleCircle}>{val}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.rangeLabelsRow}><span>Not at all</span><span>Completely</span></div>
                  </div>

                  <button type="submit" className={styles.modalSubmitGreyBtn}>
                    Check-in
                  </button>
                </form>
              </div>
              ) : (
              <div className={styles.wellbeingViewContainer}>

                {/* Grid of four custom indicator squircle cards */}
                <div className={styles.wellbeingCardsGrid}>

                  {/* Card 1: Wellbeing Activities — total activities recorded in last 30 days */}
                  <div className={styles.statCardCell}>
                    <span className={styles.statCardTitle}>Wellbeing activities</span>
                    <div className={styles.statSquircleCard}>
                      <div className={styles.statIconBadge}>
                        <img src="/wellbeing_activity.png" alt="Wellbeing activities" className={styles.statCardImage} />
                        <span className={styles.statCardCounterBubble}>{activitiesLast30}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Habit Building — badge carousel, one category per slide */}
                  <div className={styles.statCardCell}>
                    <span className={styles.statCardTitle}>Habit building</span>
                    {(() => {
                      // For each category, show only the highest achieved badge.
                      // If none achieved, show the first tier (bronze) as locked.
                      const badges = FIVE_WAYS_ACTIVITIES.map((cat) => {
                        const count = categoryCounts[cat.id] || 0;
                        // Find the highest tier where threshold is met
                        let bestTier = null;
                        for (let i = HABIT_TIERS.length - 1; i >= 0; i--) {
                          if (count >= HABIT_TIERS[i].threshold) {
                            bestTier = HABIT_TIERS[i];
                            break;
                          }
                        }
                        // If none unlocked, show the next tier to achieve (bronze) as locked
                        const displayTier = bestTier || HABIT_TIERS[0];
                        const unlocked = !!bestTier;
                        return { cat, tier: displayTier, folder: HABIT_BADGE_FOLDERS[cat.id], unlocked };
                      });
                      const total = badges.length;
                      const idx = ((habitIndex % total) + total) % total;
                      const badgeSrc = (b) => `/frames/${b.folder}/${b.tier.key}.png`;

                      const current = badges[idx];
                      const prev = badges[(idx - 1 + total) % total];
                      const next = badges[(idx + 1) % total];
                      return (
                        <>
                          <div className={styles.habitCarousel}>
                            <button
                              type="button"
                              className={`${styles.habitArrow} ${styles.habitArrowLeft}`}
                              aria-label="Previous badge"
                              onClick={() => setHabitIndex((idx - 1 + total) % total)}
                            >
                              ‹
                            </button>

                            <div className={`${styles.statSquircleCard} ${styles.habitViewport}`}>
                              <img
                                src={badgeSrc(prev)}
                                alt=""
                                aria-hidden="true"
                                className={`${styles.habitBadgeSide} ${styles.habitBadgePrev}`}
                              />
                              <img
                                src={badgeSrc(current)}
                                alt={`${current.cat.name} ${current.tier.label} badge`}
                                className={`${styles.habitBadgeMain} ${current.unlocked ? '' : styles.habitBadgeLocked}`}
                              />
                              <img
                                src={badgeSrc(next)}
                                alt=""
                                aria-hidden="true"
                                className={`${styles.habitBadgeSide} ${styles.habitBadgeNext}`}
                              />
                            </div>

                            <button
                              type="button"
                              className={`${styles.habitArrow} ${styles.habitArrowRight}`}
                              aria-label="Next badge"
                              onClick={() => setHabitIndex((idx + 1) % total)}
                            >
                              ›
                            </button>
                          </div>

                          <div className={styles.habitDots}>
                            {badges.map((_, dotIdx) => (
                              <span
                                key={dotIdx}
                                className={`${styles.habitDot} ${dotIdx === idx ? styles.habitDotActive : ''}`}
                                onClick={() => setHabitIndex(dotIdx)}
                              />
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Card 3: Smiles this month — happy moods recorded in last 30 days */}
                  <div className={styles.statCardCell}>
                    <span className={styles.statCardTitle}>Smiles this month</span>
                    <div className={styles.statSquircleCard}>
                      <div className={styles.statIconBadge}>
                        <img src="/smiles.png" alt="Smiles" className={styles.statCardImage} />
                        <span className={`${styles.statCardCounterBubble} ${styles.counterOrange}`}>{smilesLast30}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Environmental Impact */}
                  <div className={styles.statCardCell}>
                    <span className={styles.statCardTitle}>Environmental impact</span>
                    <div className={styles.statSquircleCard}>
                      <div className={styles.statIconBadge}>
                        <img src="/env_impact.png" alt="Environmental impact" className={styles.statCardImage} />
                        <span className={`${styles.statCardCounterBubble} ${styles.counterGreen}`}>{wellbeingScore > 0 ? `+${wellbeingScore}` : 0}</span>
                      </div>
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
                        <div className={`${styles.barFill} ${styles.fillPink}`} style={{ width: avgBarPct('satisfaction') }}></div>
                      </div>
                    </div>

                    <div className={styles.progressRow}>
                      <span className={styles.barLabel}>Worthwhile</span>
                      <div className={styles.barTrack}>
                        <div className={`${styles.barFill} ${styles.fillTeal}`} style={{ width: avgBarPct('worthwhile') }}></div>
                      </div>
                    </div>

                    <div className={styles.progressRow}>
                      <span className={styles.barLabel}>Happiness</span>
                      <div className={styles.barTrack}>
                        <div className={`${styles.barFill} ${styles.fillOrange}`} style={{ width: avgBarPct('happiness') }}></div>
                      </div>
                    </div>

                    <div className={styles.progressRow}>
                      <span className={styles.barLabel}>Anxiety</span>
                      <div className={styles.barTrack}>
                        <div className={`${styles.barFill} ${styles.fillGreen}`} style={{ width: avgBarPct('anxiety') }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update Check-in button */}
                <div className={styles.wellbeingActionContainer}>
                  <button
                    className={styles.capsuleDarkBtn}
                    onClick={() => setShowCheckinModal(true)}
                  >
                    Update check-in
                  </button>
                </div>

              </div>
              )
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
                  <div className={styles.settingsRow} onClick={() => { setSuccessMessage('Reset password link dispatched to email'); setTimeout(() => setSuccessMessage(''), 3500); }}>
                    <span className={styles.settingLabelText}>Reset password</span>
                    <svg className={styles.settingChevron} viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>

                  {/* Row 5: Delete account link */}
                  <div className={styles.settingsRow} onClick={() => { setSuccessMessage('Delete account request registered'); setTimeout(() => setSuccessMessage(''), 3500); }}>
                    <span className={styles.settingLabelText}>Delete account</span>
                    <svg className={styles.settingChevron} viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>

                  {/* Row 6: Feedback & Support link */}
                  <div className={styles.settingsRow} onClick={() => { setSuccessMessage('Support console opened'); setTimeout(() => setSuccessMessage(''), 3500); }}>
                    <span className={styles.settingLabelText}>Feedback & Support</span>
                    <svg className={styles.settingChevron} viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>

                  {/* Row 7: Terms and Privacy Policy link */}
                  <div className={styles.settingsRow} onClick={() => { setSuccessMessage('Terms of service loaded'); setTimeout(() => setSuccessMessage(''), 3500); }}>
                    <span className={styles.settingLabelText}>Terms and Privacy Policy</span>
                    <svg className={styles.settingChevron} viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>

                </div>
              </div>
            )}
            </>
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
              Select a day to view your organisation's curated daily activities for the day or alternately view your personal favourites using the drop down menu.
            </p>
            <p className={styles.modalBodyText}>
              Press the record button to register your completed activity and collect an element or click on an activity icon to learn more and view activity guides.
            </p>
            <p className={styles.modalBodyText}>
              To explore all activities, select All 5 Ways Activities from the drop down menu.
            </p>
            <p className={styles.modalBodyText}>
              Collecting an element in each of the 5 ways to wellbeing grows your avatar by a level. For every five levels of growth you will contribute a fully grown tree to your organisation's Saku forest.
            </p>
            <p className={styles.modalBodyText}>
              Explore more with wellbeing status and settings links.
            </p>
            <button className={styles.modalCloseCapsuleBtn} onClick={() => setShowHelpModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default Dashboard;
