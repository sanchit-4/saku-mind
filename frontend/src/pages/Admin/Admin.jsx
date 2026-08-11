import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, setDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './Admin.module.css';

// ── Category normalisation shared with Dashboard ──────────────────────────
const CATEGORY_NAME_MAP = {
  'active': 'active', 'be active': 'active', 'be_active': 'active',
  'learn': 'learn', 'keep learning': 'learn', 'keep_learning': 'learn',
  'give': 'give', 'connect': 'connect',
  'notice': 'notice', 'take notice': 'notice', 'take_notice': 'notice',
};
const normalizeCategory = (raw) => {
  if (!raw) return 'general';
  const lower = String(raw).trim().toLowerCase();
  return CATEGORY_NAME_MAP[lower] || lower;
};

// The 5 Ways categories (used for grouping the activity list)
const CATEGORIES = [
  { id: 'active', name: 'Be Active', short: 'Active' },
  { id: 'learn', name: 'Keep Learning', short: 'Learn' },
  { id: 'give', name: 'Give', short: 'Give' },
  { id: 'connect', name: 'Connect', short: 'Connect' },
  { id: 'notice', name: 'Take Notice', short: 'Notice' },
];
const CATEGORY_LABEL = (id) => CATEGORIES.find(c => c.id === id)?.name || 'General';
const CATEGORY_TAG = (id) => CATEGORY_LABEL(id);

const MAX_SELECTED = 7;
const MIN_SELECTED = 5;

// Default admin credential, seeded into Firestore on first login. The admin
// can change this from the panel (Settings tab) or directly in Firestore.
const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'SakuAdmin!2026';
const ADMIN_SESSION_KEY = 'saku_admin_authed';

const Admin = () => {
  // ── Admin authentication (dedicated login gate) ──────────────────────────
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === '1');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUsername.trim() || !loginPassword) {
      setLoginError('Please enter both a username and password.');
      return;
    }
    setLoginLoading(true);
    try {
      let credDoc = await getDoc(doc(db, 'adminCredentials', 'main'));
      if (!credDoc.exists()) {
        // Seed a default credential on first use
        await setDoc(doc(db, 'adminCredentials', 'main'), {
          username: DEFAULT_ADMIN_USERNAME,
          password: DEFAULT_ADMIN_PASSWORD,
        });
        credDoc = await getDoc(doc(db, 'adminCredentials', 'main'));
      }
      const cred = credDoc.data();
      const match =
        loginUsername.trim().toLowerCase() === (cred?.username || '').toLowerCase() &&
        loginPassword === (cred?.password || '');
      if (match) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
        setAuthed(true);
        setLoginUsername('');
        setLoginPassword('');
      } else {
        setLoginError('Invalid admin username or password.');
      }
    } catch (err) {
      setLoginError('Could not verify admin credentials: ' + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthed(false);
  };

  // ── Tabs / shared state ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('codes'); // 'codes' | 'activities' | 'settings'
  const [companyCodes, setCompanyCodes] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingCodes, setLoadingCodes] = useState(true);

  // Activities tab state
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCompanyCode, setSelectedCompanyCode] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedOrder, setSelectedOrder] = useState([]); // ordered array of activity ids
  const [savingActivities, setSavingActivities] = useState(false);

  // Settings tab state (change admin password)
  const [newPassword, setNewPassword] = useState('');
  const [changePwMsg, setChangePwMsg] = useState('');

  // Load company codes from Firestore
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'companyCodes'));
        const codes = snapshot.docs.map(d => ({ code: d.id, ...d.data() }));
        if (codes.length === 0) {
          await setDoc(doc(db, 'companyCodes', 'SK001'), { name: 'Saku Mind Ltd' });
          const seeded = [{ code: 'SK001', name: 'Saku Mind Ltd' }];
          setCompanyCodes(seeded);
          setSelectedCompanyCode('SK001');
        } else {
          setCompanyCodes(codes);
          setSelectedCompanyCode(codes[0].code);
        }
      } catch (err) {
        console.error('Error fetching company codes:', err);
        setCompanyCodes([{ code: 'SK001', name: 'Saku Mind Ltd' }]);
        setSelectedCompanyCode('SK001');
      } finally {
        setLoadingCodes(false);
      }
    };
    fetchCodes();
  }, []);

  // Load all activities from Firebase (activitiestwo), grouped/ordered later
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'activitiestwo'));
        const list = snapshot.docs.map(docSnap => {
          const d = docSnap.data();
          let normCategory = 'general';
          const raw = d.category;
          if (Array.isArray(raw) && raw.length > 0) normCategory = normalizeCategory(raw[0]);
          else if (typeof raw === 'string') normCategory = normalizeCategory(raw);
          return {
            id: docSnap.id,
            title: d.title || 'Unknown Activity',
            category: normCategory,
            image: d.imageurl || '',
            points: d.point?.points || d.points || 0,
          };
        });
        list.sort((a, b) => a.title.localeCompare(b.title));
        setActivities(list);
      } catch (err) {
        console.error('Error fetching activities from Firebase', err);
      } finally {
        setLoadingActivities(false);
      }
    };
    fetchActivities();
  }, []);

  // Load existing ordered selection when company/date changes
  useEffect(() => {
    if (!selectedCompanyCode || !selectedDate) { setSelectedOrder([]); return; }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'orgActivities', `${selectedCompanyCode}_${selectedDate}`));
        if (snap.exists() && Array.isArray(snap.data().activities)) {
          setSelectedOrder(snap.data().activities);
        } else {
          setSelectedOrder([]);
        }
      } catch (err) {
        console.error('Error loading activities:', err);
        setSelectedOrder([]);
      }
    };
    load();
  }, [selectedCompanyCode, selectedDate]);

  // ── Company codes handlers ───────────────────────────────────────────────
  const handleAddCode = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!newCode.trim() || !newCompanyName.trim()) {
      setError('Please fill in both fields.'); return;
    }
    const upperCode = newCode.trim().toUpperCase();
    if (companyCodes.some(c => c.code === upperCode)) {
      setError('This company code already exists.'); return;
    }
    try {
      await setDoc(doc(db, 'companyCodes', upperCode), { name: newCompanyName.trim() });
      const updated = [...companyCodes, { code: upperCode, name: newCompanyName.trim() }];
      setCompanyCodes(updated);
      setNewCode(''); setNewCompanyName('');
      setSuccess(`Company code ${upperCode} added successfully!`);
    } catch (err) {
      setError('Failed to save company code: ' + err.message);
    }
  };

  const handleDeleteCode = async (codeToDelete) => {
    setError(''); setSuccess('');
    try {
      await deleteDoc(doc(db, 'companyCodes', codeToDelete));
      setCompanyCodes(companyCodes.filter(c => c.code !== codeToDelete));
      if (selectedCompanyCode === codeToDelete && companyCodes.length > 1) {
        const remaining = companyCodes.filter(c => c.code !== codeToDelete);
        setSelectedCompanyCode(remaining[0].code);
      }
      setSuccess(`Company code ${codeToDelete} deleted.`);
    } catch (err) {
      setError('Failed to delete company code: ' + err.message);
    }
  };

  // ── Activity selection handlers ──────────────────────────────────────────
  const selectedCompanyName = companyCodes.find(c => c.code === selectedCompanyCode)?.name || '';

  const filteredActivities = (categoryFilter === 'all'
    ? activities
    : activities.filter(a => a.category === categoryFilter))
    .filter(a => !selectedOrder.includes(a.id));

  const addActivity = (id) => {
    setError(''); setSuccess('');
    if (selectedOrder.includes(id)) return;
    if (selectedOrder.length >= MAX_SELECTED) {
      setError(`You can select a maximum of ${MAX_SELECTED} activities.`);
      return;
    }
    setSelectedOrder([...selectedOrder, id]);
  };

  const removeActivity = (id) => {
    setSelectedOrder(selectedOrder.filter(a => a !== id));
  };

  const moveActivity = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= selectedOrder.length) return;
    const next = [...selectedOrder];
    [next[index], next[target]] = [next[target], next[index]];
    setSelectedOrder(next);
  };

  const saveActivities = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!selectedCompanyCode) { setError('Please select a company.'); return; }
    if (!selectedDate) { setError('Please select a date.'); return; }
    if (selectedOrder.length < MIN_SELECTED) {
      setError(`Please select at least ${MIN_SELECTED} activities (currently ${selectedOrder.length}).`);
      return;
    }
    if (selectedOrder.length > MAX_SELECTED) {
      setError(`Please select at most ${MAX_SELECTED} activities.`);
      return;
    }
    setSavingActivities(true);
    try {
      await setDoc(doc(db, 'orgActivities', `${selectedCompanyCode}_${selectedDate}`), {
        companyCode: selectedCompanyCode,
        companyName: selectedCompanyName,
        date: selectedDate,
        activities: selectedOrder,
        updatedAt: Date.now(),
      });
      setSuccess(`Activities saved for ${selectedCompanyName} (${selectedCompanyCode}) on ${selectedDate}! The icons now appear in your selected order on the organisational page.`);
    } catch (err) {
      setError('Failed to save activities: ' + err.message);
    } finally {
      setSavingActivities(false);
    }
  };

  const activityById = (id) => activities.find(a => a.id === id);

  // ── Change admin password ────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwMsg(''); setError(''); setSuccess('');
    if (!newPassword.trim()) { setChangePwMsg('Please enter a new password (capped at no minimum).'); return; }
    try {
      const credDoc = await getDoc(doc(db, 'adminCredentials', 'main'));
      const username = credDoc.exists() ? (credDoc.data().username || DEFAULT_ADMIN_USERNAME) : DEFAULT_ADMIN_USERNAME;
      await setDoc(doc(db, 'adminCredentials', 'main'), { username, password: newPassword.trim() }, { merge: true });
      setNewPassword('');
      setChangePwMsg('Admin password updated successfully.');
    } catch (err) {
      setChangePwMsg('Failed to update password: ' + err.message);
    }
  };

  // ── Login screen (before the panel is shown) ─────────────────────────────
  if (!authed) {
    return (
      <div className={styles.adminPageContainer}>
        <div className={styles.bgShapePink}></div>
        <div className={styles.bgShapeWhite}></div>

        <div className={styles.adminCardContainer}>
          <div className={styles.headerSection}>
            <Link to="/" className={styles.logoLink}>
              <img src="/Screenshot 2026-05-25 201144.png" alt="Saku Logo" className={styles.logoImage} />
            </Link>
            <h1 className={styles.welcomeText}>Saku Mind Admin</h1>
            <p className={styles.subText}>Restricted area — admin login required</p>
          </div>

          <form onSubmit={handleAdminLogin} className={styles.adminForm}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Admin Username</label>
              <input
                type="text"
                className={styles.inputField}
                placeholder="Admin username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.inputField}
                placeholder="Admin password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {loginError && <div className={styles.errorMessage}>{loginError}</div>}

            <button type="submit" className={styles.submitButton} disabled={loginLoading}>
              {loginLoading ? 'Verifying...' : 'Log in to Admin'}
            </button>
          </form>

          <div className={styles.backContainer}>
            <Link to="/" className={styles.backLink}>← Back to homepage</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main admin panel ─────────────────────────────────────────────────────
  return (
    <div className={styles.adminPageContainer}>
      <div className={styles.bgShapePink}></div>
      <div className={styles.bgShapeWhite}></div>

      <div className={`${styles.adminCardContainer} ${styles.adminCardWide}`}>
        <div className={styles.headerSection}>
          <Link to="/" className={styles.logoLink}>
            <img src="/Screenshot 2026-05-25 201144.png" alt="Saku Logo" className={styles.logoImage} />
          </Link>
          <h1 className={styles.welcomeText}>Saku Mind Admin Panel</h1>
          <p className={styles.subText}>
            Backend administration console &nbsp;·&nbsp;
            <button type="button" className={styles.inlineLinkBtn} onClick={handleLogout}>Logout</button>
          </p>
        </div>

        {/* Tab Selection */}
        <div className={styles.tabsContainer}>
          <button type="button"
            className={`${styles.tabBtn} ${activeTab === 'codes' ? styles.activeTab : ''}`}
            onClick={() => { setActiveTab('codes'); setError(''); setSuccess(''); }}>
            Company Codes
          </button>
          <button type="button"
            className={`${styles.tabBtn} ${activeTab === 'activities' ? styles.activeTab : ''}`}
            onClick={() => { setActiveTab('activities'); setError(''); setSuccess(''); }}>
            Activities per Date
          </button>
          <button type="button"
            className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.activeTab : ''}`}
            onClick={() => { setActiveTab('settings'); setError(''); setSuccess(''); }}>
            Settings
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        {changePwMsg && <div className={styles.successMessage}>{changePwMsg}</div>}

        {/* ── TAB 1: Company Codes ── */}
        {activeTab === 'codes' && (
          <>
            <form onSubmit={handleAddCode} className={styles.adminForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="newCode" className={styles.label}>Company Code</label>
                <input type="text" id="newCode" className={styles.inputField}
                  placeholder="e.g. SK002"
                  value={newCode} onChange={(e) => setNewCode(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="newCompanyName" className={styles.label}>Company Name</label>
                <input type="text" id="newCompanyName" className={styles.inputField}
                  placeholder="e.g. Acme Corporation"
                  value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} required />
              </div>
              <button type="submit" className={styles.submitButton}>Add Company Code</button>
            </form>

            <div className={styles.listSection}>
              <h2 className={styles.listTitle}>Registered Company Codes</h2>
              {loadingCodes ? (
                <p className={styles.noCodesText}>Loading company codes...</p>
              ) : companyCodes.length === 0 ? (
                <p className={styles.noCodesText}>No company codes registered yet.</p>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.codeTable}>
                    <thead>
                      <tr><th>Code</th><th>Company Name</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {companyCodes.map((item) => (
                        <tr key={item.code}>
                          <td className={styles.codeCell}>{item.code}</td>
                          <td>{item.name}</td>
                          <td>
                            <button className={styles.deleteButton} onClick={() => handleDeleteCode(item.code)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── TAB 2: Activities per Date ── */}
        {activeTab === 'activities' && (
          <form onSubmit={saveActivities} className={styles.adminForm}>
            <div className={styles.twoColRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="companySelect" className={styles.label}>Select Company</label>
                <select id="companySelect" className={styles.selectField}
                  value={selectedCompanyCode}
                  onChange={(e) => setSelectedCompanyCode(e.target.value)} required>
                  {companyCodes.map(c => (
                    <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="dateSelect" className={styles.label}>Select Date</label>
                <input type="date" id="dateSelect" className={styles.inputField}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)} required />
              </div>
            </div>

            {/* Selected (ordered) list */}
            <div className={styles.listSection}>
              <div className={styles.selectedHeaderRow}>
                <h2 className={styles.listTitle}>Selected Activities (in order)</h2>
                <span className={`${styles.orderCount} ${selectedOrder.length < MIN_SELECTED ? styles.orderCountWarn : ''}`}>
                  {selectedOrder.length} / {MAX_SELECTED}
                </span>
              </div>
              <p className={styles.hintText}>
                Pick {MIN_SELECTED}–{MAX_SELECTED} activities. Icons will appear left-to-right (in this order) on the semicircle of the organisational page.
              </p>
              {selectedOrder.length === 0 ? (
                <p className={styles.noCodesText}>No activities selected for this date yet.</p>
              ) : (
                <div className={styles.orderList}>
                  {selectedOrder.map((id, idx) => {
                    const act = activityById(id);
                    return (
                      <div key={id} className={styles.orderRow}>
                        <span className={styles.orderNumber}>{idx + 1}</span>
                        {act?.image && <img src={act.image} alt="" className={styles.orderImg} />}
                        <div className={styles.orderInfo}>
                          <span className={styles.orderTitle}>{act?.title || id}</span>
                          <span className={styles.orderCat}>{CATEGORY_TAG(act?.category)}</span>
                        </div>
                        <div className={styles.orderControls}>
                          <button type="button" className={styles.upDownBtn} onClick={() => moveActivity(idx, -1)} aria-label="Move up" disabled={idx === 0}>↑</button>
                          <button type="button" className={styles.upDownBtn} onClick={() => moveActivity(idx, 1)} aria-label="Move down" disabled={idx === selectedOrder.length - 1}>↓</button>
                          <button type="button" className={styles.removeBtn} onClick={() => removeActivity(id)} aria-label="Remove">×</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available activities picker (filtered by category) */}
            <div className={styles.checklistSection}>
              <span className={styles.label}>Available Activities (from Firebase)</span>

              <div className={styles.categoryChips}>
                <button type="button"
                  className={`${styles.categoryChip} ${categoryFilter === 'all' ? styles.categoryChipActive : ''}`}
                  onClick={() => setCategoryFilter('all')}>All</button>
                {CATEGORIES.map(c => (
                  <button type="button" key={c.id}
                    className={`${styles.categoryChip} ${categoryFilter === c.id ? styles.categoryChipActive : ''}`}
                    onClick={() => setCategoryFilter(c.id)}>{c.name}</button>
                ))}
              </div>

              {loadingActivities ? (
                <p className={styles.noCodesText}>Loading activities from Firebase...</p>
              ) : filteredActivities.length === 0 ? (
                <p className={styles.noCodesText}>No available activities in this category (all may already be selected).</p>
              ) : (
                <div className={styles.availList}>
                  {filteredActivities.map(act => (
                    <div key={act.id} className={styles.availRow}>
                      {act.image && <img src={act.image} alt="" className={styles.availImg} />}
                      <div className={styles.availInfo}>
                        <span className={styles.availTitle}>{act.title}</span>
                        <span className={styles.availCat}>{CATEGORY_TAG(act.category)}{act.points ? ` · ${act.points} pts` : ''}</span>
                      </div>
                      <button type="button" className={styles.addBtn}
                        onClick={() => addActivity(act.id)}
                        disabled={selectedOrder.length >= MAX_SELECTED}>Add</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className={styles.submitButton} disabled={savingActivities}>
              {savingActivities ? 'Saving...' : `Save Activities for Date (${selectedOrder.length}/${MAX_SELECTED})`}
            </button>
          </form>
        )}

        {/* ── TAB 3: Settings (change admin password) ── */}
        {activeTab === 'settings' && (
          <form onSubmit={handleChangePassword} className={styles.adminForm}>
            <div className={styles.listSection}>
              <h2 className={styles.listTitle}>Admin Security</h2>
              <p className={styles.hintText}>Change the password used to access this admin panel.</p>
              <div className={styles.inputGroup}>
                <label htmlFor="newPassword" className={styles.label}>New Password</label>
                <input type="password" id="newPassword" className={styles.inputField}
                  placeholder="Enter a new admin password"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <button type="submit" className={styles.submitButton}>Update Admin Password</button>
            </div>
          </form>
        )}

        <div className={styles.backContainer}>
          <Link to="/secure-login" className={styles.backLink}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;