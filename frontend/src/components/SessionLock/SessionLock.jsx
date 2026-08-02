/**
 * SessionLock — Data security lock layer for /sakumindapp
 *
 * Three lock triggers:
 *  1. User navigates away (visibility hidden / beforeunload)
 *  2. Page is idle for IDLE_TIMEOUT_MS (5 minutes)
 *  3. User clicks the Saku "Step Ahead" / profile icon (handled in Dashboard — navigates to /)
 *
 * When locked:
 *  - A full-screen overlay replaces the page content
 *  - User must re-enter their password (Firebase re-authentication)
 *  - A "Leave" confirmation dialog appears when they try to navigate away
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { signInWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../AuthContext/AuthContext';
import styles from './SessionLock.module.css';

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export default function SessionLock({ children }) {
  const { currentUser } = useAuth();
  const [locked, setLocked] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingNavUrl, setPendingNavUrl] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const idleTimer = useRef(null);

  // ── Idle timer ─────────────────────────────────────────────────────────────
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current);
    if (!locked) {
      idleTimer.current = setTimeout(() => {
        setLocked(true);
      }, IDLE_TIMEOUT_MS);
    }
  }, [locked]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
    resetIdleTimer(); // Start timer on mount
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  // ── Visibility change (tab switch / browser minimize) ─────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setLocked(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // ── beforeunload — show browser native dialog + lock on return ─────────────
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!locked) {
        setLocked(true);
        e.preventDefault();
        e.returnValue = ''; // triggers browser's native "Leave site?" dialog
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [locked]);

  // ── Intercept in-app link clicks that lead outside /sakumindapp ─────────────
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      // Only intercept external or non-app links
      const isInternal = href.startsWith('/sakumindapp') || href === '#';
      if (!isInternal) {
        e.preventDefault();
        setPendingNavUrl(href);
        setShowLeaveConfirm(true);
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // ── Unlock with password ────────────────────────────────────────────────────
  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password) return;
    setUnlocking(true);
    setError('');
    try {
      const email = currentUser?.email;
      if (!email) throw new Error('No user session found.');
      // Re-authenticate silently
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      setLocked(false);
      setPassword('');
      resetIdleTimer();
    } catch (err) {
      setError('Incorrect password. Please try again.');
    } finally {
      setUnlocking(false);
    }
  };

  // ── Confirm leave dialog ────────────────────────────────────────────────────
  const handleConfirmLeave = () => {
    setShowLeaveConfirm(false);
    setLocked(true);
    if (pendingNavUrl) {
      window.location.href = pendingNavUrl;
    }
    setPendingNavUrl(null);
  };

  const handleCancelLeave = () => {
    setShowLeaveConfirm(false);
    setPendingNavUrl(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Leave confirmation dialog */}
      {showLeaveConfirm && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Leave confirmation">
          <div className={styles.lockCard}>
            <h2 className={styles.lockTitle}>Leaving Saku Mind?</h2>
            <p className={styles.lockSubtitle}>
              For data security, the app will be locked when you leave. You'll need your password to re-enter.
            </p>
            <div className={styles.leaveActions}>
              <button className={styles.leaveBtn} onClick={handleConfirmLeave}>
                Leave &amp; Lock
              </button>
              <button className={styles.stayBtn} onClick={handleCancelLeave}>
                Stay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock screen */}
      {locked && !showLeaveConfirm && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="App locked">
          <div className={styles.lockCard}>
            <img src="/Screenshot 2026-05-25 201144.png" alt="Saku Mind" className={styles.lockLogo} />
            <h2 className={styles.lockTitle}>App Locked</h2>
            <p className={styles.lockSubtitle}>
              For your data security, Saku Mind has been locked. Please enter your password to continue.
            </p>
            <form onSubmit={handleUnlock} className={styles.lockForm}>
              <input
                type="password"
                className={styles.lockInput}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoFocus
                autoComplete="current-password"
              />
              {error && <p className={styles.lockError}>{error}</p>}
              <button type="submit" className={styles.unlockBtn} disabled={unlocking}>
                {unlocking ? 'Unlocking…' : 'Unlock'}
              </button>
            </form>
            <p className={styles.lockHint}>
              Locked due to inactivity or navigation away from the app.
            </p>
          </div>
        </div>
      )}

      {/* Normal content */}
      {children}
    </>
  );
}
