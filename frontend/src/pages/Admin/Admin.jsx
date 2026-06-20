import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, setDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './Admin.module.css';

const ACTIVITIES_LIST = [
  { id: 'yin-yoga', title: 'Outdoor Yin Yoga' },
  { id: 'kayaking', title: 'Kayaking' },
  { id: 'local-trees', title: 'Identifying local trees' },
  { id: 'walking', title: 'Mindful Walking' },
  { id: 'gardening', title: 'Gardening' },
  { id: 'cycling', title: 'Scenic Cycling' },
  { id: 'breathing', title: 'Box Breathing' },
  { id: 'journaling', title: 'Gratitude Journaling' },
  { id: 'social-chat', title: 'Coffee Catch-up' },
  { id: 'stretching', title: 'Desk Stretching' }
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('codes'); // 'codes' or 'activities'
  const [companyCodes, setCompanyCodes] = useState([]);
  
  // Tab 1 state
  const [newCode, setNewCode] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  
  // Tab 2 state
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingCodes, setLoadingCodes] = useState(true);

  // Load company codes from Firestore
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'companyCodes'));
        const codes = snapshot.docs.map(d => ({ code: d.id, ...d.data() }));
        
        // If empty, seed with default
        if (codes.length === 0) {
          await setDoc(doc(db, 'companyCodes', 'SK001'), { name: 'Saku Mind Ltd' });
          setCompanyCodes([{ code: 'SK001', name: 'Saku Mind Ltd' }]);
          setSelectedCompany('Saku Mind Ltd');
        } else {
          setCompanyCodes(codes);
          setSelectedCompany(codes[0].name);
        }
      } catch (err) {
        console.error('Error fetching company codes:', err);
        // Fallback
        setCompanyCodes([{ code: 'SK001', name: 'Saku Mind Ltd' }]);
        setSelectedCompany('Saku Mind Ltd');
      } finally {
        setLoadingCodes(false);
      }
    };
    fetchCodes();
  }, []);

  // Sync selected activities when date/company changes
  useEffect(() => {
    if (!selectedCompany || !selectedDate) return;
    const fetchActivities = async () => {
      const docKey = `${selectedCompany}_${selectedDate}`;
      try {
        const docSnap = await getDoc(doc(db, 'orgActivities', docKey));
        if (docSnap.exists()) {
          setSelectedActivities(docSnap.data().activities || []);
        } else {
          setSelectedActivities([]);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setSelectedActivities([]);
      }
    };
    fetchActivities();
  }, [selectedCompany, selectedDate]);

  const handleAddCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newCode.trim() || !newCompanyName.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    const upperCode = newCode.trim().toUpperCase();
    
    if (companyCodes.some(c => c.code === upperCode)) {
      setError('This company code already exists.');
      return;
    }

    try {
      await setDoc(doc(db, 'companyCodes', upperCode), { name: newCompanyName.trim() });
      const updatedCodes = [...companyCodes, { code: upperCode, name: newCompanyName.trim() }];
      setCompanyCodes(updatedCodes);
      setNewCode('');
      setNewCompanyName('');
      setSuccess(`Company code ${upperCode} added successfully!`);
    } catch (err) {
      setError('Failed to save company code: ' + err.message);
    }
  };

  const handleDeleteCode = async (codeToDelete) => {
    setError('');
    setSuccess('');
    try {
      await deleteDoc(doc(db, 'companyCodes', codeToDelete));
      setCompanyCodes(companyCodes.filter(c => c.code !== codeToDelete));
      setSuccess(`Company code ${codeToDelete} deleted.`);
    } catch (err) {
      setError('Failed to delete company code: ' + err.message);
    }
  };

  const handleToggleActivity = (activityId) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  const handleSaveActivities = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedCompany) {
      setError('Please select a company.');
      return;
    }
    if (!selectedDate) {
      setError('Please select a date.');
      return;
    }

    const docKey = `${selectedCompany}_${selectedDate}`;
    try {
      await setDoc(doc(db, 'orgActivities', docKey), {
        company: selectedCompany,
        date: selectedDate,
        activities: selectedActivities
      });
      setSuccess(`Activities updated for ${selectedCompany} on ${selectedDate}!`);
    } catch (err) {
      setError('Failed to save activities: ' + err.message);
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <div className={styles.bgShapePink}></div>
      <div className={styles.bgShapeWhite}></div>

      <div className={styles.adminCardContainer}>
        <div className={styles.headerSection}>
          <Link to="/" className={styles.logoLink}>
            <img 
              src="/Screenshot 2026-05-25 201144.png" 
              alt="Saku Logo" 
              className={styles.logoImage} 
            />
          </Link>
          <h1 className={styles.welcomeText}>Saku Mind Admin Panel</h1>
          <p className={styles.subText}>Backend administration console</p>
        </div>

        {/* Tab Selection */}
        <div className={styles.tabsContainer}>
          <button 
            type="button" 
            className={`${styles.tabBtn} ${activeTab === 'codes' ? styles.activeTab : ''}`}
            onClick={() => { setActiveTab('codes'); setError(''); setSuccess(''); }}
          >
            Company Codes
          </button>
          <button 
            type="button" 
            className={`${styles.tabBtn} ${activeTab === 'activities' ? styles.activeTab : ''}`}
            onClick={() => { setActiveTab('activities'); setError(''); setSuccess(''); }}
          >
            Activities per Date
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        {/* TAB 1: Company Codes */}
        {activeTab === 'codes' && (
          <>
            <form onSubmit={handleAddCode} className={styles.adminForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="newCode" className={styles.label}>Company Code</label>
                <input 
                  type="text" 
                  id="newCode" 
                  className={styles.inputField} 
                  placeholder="e.g. SK002"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required 
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newCompanyName" className={styles.label}>Company Name</label>
                <input 
                  type="text" 
                  id="newCompanyName" 
                  className={styles.inputField} 
                  placeholder="e.g. Acme Corporation"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Add Company Code
              </button>
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
                      <tr>
                        <th>Code</th>
                        <th>Company Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyCodes.map((item) => (
                        <tr key={item.code}>
                          <td className={styles.codeCell}>{item.code}</td>
                          <td>{item.name}</td>
                          <td>
                            <button 
                              className={styles.deleteButton} 
                              onClick={() => handleDeleteCode(item.code)}
                            >
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

        {/* TAB 2: Activities per Date */}
        {activeTab === 'activities' && (
          <form onSubmit={handleSaveActivities} className={styles.adminForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="companySelect" className={styles.label}>Select Company</label>
              <select 
                id="companySelect" 
                className={styles.selectField}
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                required
              >
                {companyCodes.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="dateSelect" className={styles.label}>Select Date</label>
              <input 
                type="date" 
                id="dateSelect" 
                className={styles.inputField} 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required 
              />
            </div>

            <div className={styles.checklistSection}>
              <span className={styles.label}>Select Active Activities for this Date</span>
              <div className={styles.checklistGrid}>
                {ACTIVITIES_LIST.map(act => (
                  <label key={act.id} className={styles.checkLabel}>
                    <input 
                      type="checkbox" 
                      checked={selectedActivities.includes(act.id)}
                      onChange={() => handleToggleActivity(act.id)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkText}>{act.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Save Activities for Date
            </button>
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
