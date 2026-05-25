import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.logoContainer}>
        <img 
          src="/Screenshot 2026-05-25 201144.png" 
          alt="Saku Logo" 
          className={styles.logoImage} 
        />
      </Link>
      
      <nav className={styles.navigation}>
        <ul className={styles.menuList}>
          {!currentUser ? (
            <>
              <li>
                <NavLink 
                  to="/what-we-do" 
                  className={({ isActive }) => 
                    isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                  }
                >
                  What we do
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/saku-ahead" 
                  className={({ isActive }) => 
                    isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                  }
                >
                  Saku AHEAD
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/secure-login" 
                  className={({ isActive }) => 
                    isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                  }
                >
                  Secure login
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/about-us" 
                  className={({ isActive }) => 
                    isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                  }
                >
                  About us
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/saku-blog" 
                  className={({ isActive }) => 
                    isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                  }
                >
                  Saku blog
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                  }
                >
                  Saku Journey
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/wellbeing-status" 
                  className={({ isActive }) => 
                    isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                  }
                >
                  Wellbeing Status
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => 
                    isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                  }
                >
                  Settings
                </NavLink>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className={styles.menuItemButton}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
        
        {/* Social Icons positioned directly below the navigation list */}
        <div className={styles.socialContainer}>
          <button className={styles.socialButton} aria-label="Email">
            <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
              <circle cx="18" cy="8" r="3" fill="#f26b32" stroke="none"></circle> {/* Saku Orange notification dot */}
            </svg>
          </button>
          
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`${styles.socialButton} ${styles.linkedin}`} 
            aria-label="LinkedIn"
          >
            <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
