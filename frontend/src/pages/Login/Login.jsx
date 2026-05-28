import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  // Auth state: 'login', 'signup_code', 'signup_confirm', 'signup_prefilled'
  const [authState, setAuthState] = useState('signup_code');
  const [companyCode, setCompanyCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Load codes and preseed if missing
  useEffect(() => {
    try {
      const savedCodes = localStorage.getItem('saku_company_codes');
      if (!savedCodes) {
        const defaultCodes = [{ code: 'SK001', name: 'Saku Mind Ltd' }];
        localStorage.setItem('saku_company_codes', JSON.stringify(defaultCodes));
      } else {
        JSON.parse(savedCodes);
      }
    } catch (e) {
      const defaultCodes = [{ code: 'SK001', name: 'Saku Mind Ltd' }];
      localStorage.setItem('saku_company_codes', JSON.stringify(defaultCodes));
    }
  }, []);

  // Validate Company Code
  const handleValidateCode = (e) => {
    e.preventDefault();
    setError('');

    if (!companyCode.trim()) {
      setError('Please enter a company code.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    let savedCodes = [];
    try {
      savedCodes = JSON.parse(localStorage.getItem('saku_company_codes') || '[]');
    } catch (e) {
      savedCodes = [{ code: 'SK001', name: 'Saku Mind Ltd' }];
    }
    const matched = savedCodes.find(
      (c) => c.code.toUpperCase() === companyCode.trim().toUpperCase()
    );

    if (matched) {
      setCompanyName(matched.name);
      setAuthState('signup_confirm'); // Open modal overlay
    } else {
      setError('Invalid company code. Please check with your employer or register one in Admin panel.');
    }
  };

  // Confirm Modal Action
  const handleConfirmCompany = () => {
    setAuthState('signup_prefilled');
  };

  // Complete Signup Registration
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password);
      // Mark onboarding as needed
      localStorage.setItem('needsOnboarding', 'true');
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Failed to create account. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  // Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const needsOnboarding = localStorage.getItem('needsOnboarding') === 'true';
      if (needsOnboarding) {
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
      {/* SAKU Logo outside the card (centered at the top of the page) */}
      <div className={styles.logoHeaderOutside}>
        <Link to="/" className={styles.logoLink}>
          <img 
            src="/Screenshot 2026-05-25 201144.png" 
            alt="Saku Logo" 
            className={styles.logoImageOutside} 
          />
        </Link>
        <div className={styles.logoTextOutside}>SAKU</div>
      </div>

      {/* Main squircle card container */}
      <div 
        className={`${styles.authCard} ${
          authState === 'login' ? styles.pinkCard : styles.lightBlueCard
        }`}
      >
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* STATE 1: Account Creation Code Input Form */}
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

        {/* STATE 2: Confirmation Modal Overlay */}
        {authState === 'signup_confirm' && (
          <div className={styles.modalOverlay}>
            <div className={styles.confirmModal}>
              <button 
                type="button" 
                className={styles.closeModalBtn}
                onClick={() => setAuthState('signup_code')}
                aria-label="Close"
              >
                &times;
              </button>
              
              <p className={styles.modalHeading}>Confirm your employer</p>
              
              <p className={styles.modalText}>
                If your company is <strong className={styles.highlightCompany}>"{companyName},"</strong> tap confirm to proceed with account creation, or cancel to modify details.
              </p>
              
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setAuthState('signup_code')}
                >
                  Cancel
                </button>
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

        {/* STATE 3: Prefilled Review Form */}
        {authState === 'signup_prefilled' && (
          <form onSubmit={handleSignupSubmit} className={styles.authForm}>
            <h1 className={styles.titleText}>Confirm Details</h1>

            <div className={styles.inputStack}>
              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Employer</label>
                <input 
                  type="text" 
                  className={`${styles.inputField} ${styles.prefilledInput}`} 
                  value={companyName}
                  disabled
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Email ID</label>
                <input 
                  type="email" 
                  className={`${styles.inputField} ${styles.prefilledInput}`} 
                  value={email}
                  disabled
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Password</label>
                <input 
                  type="text" 
                  className={`${styles.inputField} ${styles.prefilledInput}`} 
                  value="••••••••••••"
                  disabled
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Registering...' : 'Create account'}
            </button>

            <button 
              type="button" 
              className={styles.editDetailsBtn}
              onClick={() => setAuthState('signup_code')}
            >
              Modify Details
            </button>
          </form>
        )}

        {/* STATE 4: Login Form */}
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

      {/* Admin Access Panel Link at the very bottom */}
      <div className={styles.adminFooter}>
        <Link to="/admin" className={styles.adminLink}>
          Click here for Admin access
        </Link>
      </div>
    </div>
  );
};

export default Login;
