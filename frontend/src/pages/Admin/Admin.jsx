import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // Load codes from LocalStorage
  useEffect(() => {
    let loadedCodes = [];
    try {
      const savedCodes = localStorage.getItem('saku_company_codes');
      if (savedCodes) {
        loadedCodes = JSON.parse(savedCodes);
      } else {
        loadedCodes = [{ code: 'SK001', name: 'Saku Mind Ltd' }];
        localStorage.setItem('saku_company_codes', JSON.stringify(loadedCodes));
      }
    } catch (e) {
      loadedCodes = [{ code: 'SK001', name: 'Saku Mind Ltd' }];
      localStorage.setItem('saku_company_codes', JSON.stringify(loadedCodes));
    }
    setCompanyCodes(loadedCodes);
    if (loadedCodes.length > 0) {
      setSelectedCompany(loadedCodes[0].name);
    }
  }, []);

  // Sync selected activities when date/company changes
  useEffect(() => {
    if (!selectedCompany || !selectedDate) return;
    const dbKey = `${selectedCompany}_${selectedDate}`;
    try {
      const savedActivities = localStorage.getItem('saku_org_activities_by_date');
      if (savedActivities) {
        const db = JSON.parse(savedActivities);
        setSelectedActivities(db[dbKey] || []);
      } else {
        setSelectedActivities([]);
      }
    } catch (e) {
      setSelectedActivities([]);
    }
  }, [selectedCompany, selectedDate]);

  const handleAddCode = (e) => {
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

    const updatedCodes = [...companyCodes, { code: upperCode, name: newCompanyName.trim() }];
    localStorage.setItem('saku_company_codes', JSON.stringify(updatedCodes));
    setCompanyCodes(updatedCodes);
    setNewCode('');
    setNewCompanyName('');
    setSuccess(`Company code ${upperCode} added successfully!`);
  };

  const handleDeleteCode = (codeToDelete) => {
    setError('');
    setSuccess('');
    const updatedCodes = companyCodes.filter(c => c.code !== codeToDelete);
    localStorage.setItem('saku_company_codes', JSON.stringify(updatedCodes));
    setCompanyCodes(updatedCodes);
    setSuccess(`Company code ${codeToDelete} deleted.`);
  };

  const handleToggleActivity = (activityId) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  const handleSaveActivities = (e) => {
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

    const dbKey = `${selectedCompany}_${selectedDate}`;
    const savedActivities = localStorage.getItem('saku_org_activities_by_date');
    let db = {};
    if (savedActivities) {
      try {
        db = JSON.parse(savedActivities);
      } catch (e) {
        console.error('Error parsing saku_org_activities_by_date', e);
      }
    }
    
    db[dbKey] = selectedActivities;
    localStorage.setItem('saku_org_activities_by_date', JSON.stringify(db));
    setSuccess(`Activities updated for ${selectedCompany} on ${selectedDate}!`);
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
              {companyCodes.length === 0 ? (
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
