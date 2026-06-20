import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../components/AuthContext/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  /**
   * Auth states:
   *   'signup_code'      → Only company-code input visible
   *   'signup_confirm'   → Full-screen modal with login2.png inner shape
   *   'signup_form'      → Company code confirmed, show email + password fields
   *   'login'            → Existing user login form
   */
  const [authState, setAuthState] = useState('signup_code');
  const [companyCode, setCompanyCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  // Default company codes fallback (used when Firestore is unavailable)
  const DEFAULT_CODES = [{ code: 'SK001', name: 'Saku Mind Ltd' }];

  // Helper: check code against Firestore, fallback to defaults
  const validateCode = async (code) => {
    const upperCode = code.trim().toUpperCase();

    // Try Firestore first
    try {
      const docSnap = await getDoc(doc(db, 'companyCodes', upperCode));
      if (docSnap.exists()) {
        return { valid: true, name: docSnap.data().name, source: 'firestore' };
      }
      // Document doesn't exist in Firestore — show this info
      console.warn(`Company code "${upperCode}" not found in Firestore companyCodes collection`);
    } catch (err) {
      // Show the exact Firebase error so user can debug
      console.error('Firebase error:', err.code, err.message);
      setError(`Firebase error: ${err.code || ''} — ${err.message}`);
      // Still try fallback below
    }

    // Fallback to default codes
    const matched = DEFAULT_CODES.find(c => c.code === upperCode);
    if (matched) {
      return { valid: true, name: matched.name, source: 'fallback' };
    }

    return { valid: false };
  };

  // ── Step 1: Validate company code on form submit ──
  const handleValidateCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!companyCode.trim()) {
      setError('Please enter a company code.');
      return;
    }

    const result = await validateCode(companyCode);
    if (result.valid) {
      setCompanyName(result.name);
      setAuthState('signup_confirm');
    } else {
      setError('Invalid company code. Please check with your employer.');
    }
  };

  // ── Auto-validate on blur (user tabs/clicks away from company code field) ──
  const handleCodeBlur = async () => {
    if (!companyCode.trim()) return;

    const result = await validateCode(companyCode);
    if (result.valid) {
      setCompanyName(result.name);
      setAuthState('signup_confirm');
    }
  };

  // ── Step 2: Confirm company in modal ──
  const handleConfirmCompany = () => {
    setAuthState('signup_form');
  };

  // ── Step 3: Create account ──
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, companyCode, companyName);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Failed to create account. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  // ── Login submit ──
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const credential = await login(email, password);
      // Fetch user profile from Firestore to check onboarding status
      const profile = await fetchUserProfile(credential.user.uid);
      if (profile && profile.needsOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPageContainer}>

      {/* ── Confirmation Modal (full-screen overlay) ── */}
      {authState === 'signup_confirm' && (
        <div className={styles.modalOverlayFullscreen}>
          {/* Logo above the shape */}
          <div className={styles.modalLogoHeader}>
            <img
              src="/Screenshot 2026-05-25 201144.png"
              alt="Saku Logo"
              className={styles.modalLogoImg}
            />
            <div className={styles.modalLogoText}>SAKU</div>
          </div>

          {/* Outer squircle (login1.png) */}
          <div className={styles.modalShapeContainer}>
            {/* Inner dark squircle (login2.png) */}
            <div className={styles.confirmModalInner}>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setAuthState('signup_code')}
                aria-label="Close"
              >
                &times;
              </button>

              <p className={styles.modalText}>
                If your company is <strong className={styles.highlightCompany}>"{companyName},"</strong>{' '}
                tap confirm to proceed with account creation. If not, close this pop-up to reenter your company code.
              </p>

              <button
                type="button"
                className={styles.confirmBtn}
                onClick={handleConfirmCompany}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SAKU Logo (above the card) ── */}
      <div className={styles.logoHeaderOutside}>
        <Link to="/" className={styles.logoLink}>
          <img
            src="/login-scree-logo.png"
            alt="Saku Logo"
            className={styles.logoImageOutside}
          />
        </Link>
      </div>

      {/* ── Main Squircle Card ── */}
      <div
        className={`${styles.authCard} ${authState === 'login' ? styles.pinkCard : styles.lightBlueCard
          }`}
      >
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* ── STATE: signup_code — All fields visible, code validated on blur ── */}
        {authState === 'signup_code' && (
          <form onSubmit={handleValidateCode} className={styles.authForm}>
            <div className={styles.inputStack}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Company code"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  onBlur={handleCodeBlur}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="email"
                  className={styles.inputField}
                  placeholder="Login"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="password"
                  className={styles.inputField}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Create account
            </button>

            <p className={styles.termsText}>
              By creating an account, you<br />
              are agreeing to our <span className={styles.underlineText}>Terms and</span><br />
              <span className={styles.underlineText}>Privacy Policy</span>.
            </p>

            <div className={styles.toggleTextContainer}>
              <span>Already a member? </span>
              <button
                type="button"
                className={styles.toggleLink}
                onClick={() => {
                  setAuthState('login');
                  setError('');
                }}
              >
                Login
              </button>
            </div>
          </form>
        )}

        {/* ── STATE: signup_form — After confirmation, create account ── */}
        {authState === 'signup_form' && (
          <form onSubmit={handleSignupSubmit} className={styles.authForm}>
            <div className={styles.inputStack}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={`${styles.inputField} ${styles.prefilledInput}`}
                  value={companyName}
                  disabled
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="email"
                  className={styles.inputField}
                  placeholder="Login"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="password"
                  className={styles.inputField}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Registering...' : 'Create account'}
            </button>

            <p className={styles.termsText}>
              By creating an account, you<br />
              are agreeing to our <span className={styles.underlineText}>Terms and</span><br />
              <span className={styles.underlineText}>Privacy Policy</span>.
            </p>

            <div className={styles.toggleTextContainer}>
              <span>Already a member? </span>
              <button
                type="button"
                className={styles.toggleLink}
                onClick={() => {
                  setAuthState('login');
                  setError('');
                }}
              >
                Login
              </button>
            </div>
          </form>
        )}

        {/* ── STATE: login — Existing user sign-in ── */}
        {authState === 'login' && (
          <form onSubmit={handleLoginSubmit} className={styles.authForm}>
            <h2 className={styles.loginTitle}>Welcome back to Saku.</h2>
            <p className={styles.loginSubtitle}>
              To sign in enter your email address and password.
            </p>

            <div className={styles.inputStack}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  className={styles.inputField}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="password"
                  className={styles.inputField}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className={styles.loginOptions}>
              <span className={styles.forgotPassword}>Forgot password? Reset</span>
            </div>

            <div className={styles.toggleTextContainer}>
              <button
                type="button"
                className={styles.toggleLink}
                onClick={() => {
                  setAuthState('signup_code');
                  setError('');
                }}
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};

export default Login;
