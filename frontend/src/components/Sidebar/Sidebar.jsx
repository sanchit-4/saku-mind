import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  const close = () => setMobileOpen(false);

  const navLinks = !currentUser ? (
    <>
      <li>
        <NavLink to="/what-we-do" onClick={close}
          className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          What we do
        </NavLink>
      </li>
      <li>
        <NavLink to="/saku-ahead" onClick={close}
          className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          Saku AHEAD
        </NavLink>
      </li>
      <li>
        <NavLink to="/secure-login" onClick={close}
          className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          Secure login
        </NavLink>
      </li>
      <li>
        <NavLink to="/about-us" onClick={close}
          className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          About us
        </NavLink>
      </li>
      <li>
        <NavLink to="/saku-blog" onClick={close}
          className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          Saku blog
        </NavLink>
      </li>
    </>
  ) : (
    <>
      <li>
        <NavLink to="/dashboard" onClick={close}
          className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          Saku Journey
        </NavLink>
      </li>
      <li>
        <NavLink to="/wellbeing-status" onClick={close}
          className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          Wellbeing Status
        </NavLink>
      </li>
      <li>
        <NavLink to="/settings" onClick={close}
          className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          Settings
        </NavLink>
      </li>
      <li>
        <button onClick={() => { handleLogout(); close(); }} className={styles.menuItemButton}>
          Logout
        </button>
      </li>
    </>
  );

  const socialIcons = (
    <div className={styles.socialContainer}>
      <a href="mailto:hello@sakumind.com" className={styles.socialButton} aria-label="Email Saku Mind">
        <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </a>
      <a href="https://www.linkedin.com/company/saku-mind" target="_blank" rel="noopener noreferrer"
        className={`${styles.socialButton} ${styles.linkedin}`} aria-label="LinkedIn">
        <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </a>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar (hidden on desktop) ── */}
      <div className={styles.mobileTopBar}>
        <Link to="/" className={styles.mobileLogoLink}>
          <img src="/Screenshot 2026-05-25 201144.png" alt="Saku Logo" className={styles.mobileLogoImage} />
        </Link>
        <button className={styles.hamburger} onClick={() => setMobileOpen(true)} aria-label="Open navigation menu">
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* ── Overlay (mobile only, dims the page when drawer is open) ── */}
      {mobileOpen && <div className={styles.overlay} onClick={close} />}

      {/* ── Sidebar / Drawer ── */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>

        {/* Close button (mobile only) */}
        <button className={styles.closeButton} onClick={close} aria-label="Close menu">✕</button>

        <Link to="/" className={styles.logoContainer} onClick={close}>
          <img src="/Screenshot 2026-05-25 201144.png" alt="Saku Logo" className={styles.logoImage} />
        </Link>

        <nav className={styles.navigation}>
          <ul className={styles.menuList}>
            {navLinks}
          </ul>
          {socialIcons}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
