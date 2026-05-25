import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password);
        // Mark that this user needs onboarding in local storage
        localStorage.setItem("needsOnboarding", "true");
        navigate('/onboarding');
      } else {
        await login(email, password);
        // Check if onboarding was completed
        const needsOnboarding = localStorage.getItem("needsOnboarding") === "true";
        if (needsOnboarding) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      {/* Decorative organic shapes in background */}
      <div className={styles.bgShapePink}></div>
      <div className={styles.bgShapeWhite}></div>

      <div className={styles.loginCardContainer}>
        {/* Logo and Welcome Section */}
        <div className={styles.headerSection}>
          <Link to="/" className={styles.logoLink}>
            <img 
              src="/Screenshot 2026-05-25 201144.png" 
              alt="Saku Logo" 
              className={styles.logoImage} 
            />
          </Link>
          <h1 className={styles.welcomeText}>
            {isSignUp ? 'Create your account.' : 'Welcome back to Saku.'}
          </h1>
          <p className={styles.subText}>
            {isSignUp 
              ? 'Enter an email and password to start your journey.' 
              : 'To sign in enter your email address and password.'}
          </p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input 
              type="email" 
              id="email" 
              className={styles.inputField} 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input 
              type="password" 
              id="password" 
              className={styles.inputField} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Processing...' : (isSignUp ? 'Create account' : 'Sign in')}
          </button>
        </form>

        {/* Options */}
        <div className={styles.optionsContainer}>
          <span 
            className={styles.toggleAuthMode}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </span>
          {!isSignUp && <span className={styles.resetLink}>Forgot password? Reset</span>}
        </div>

        {/* Back Link */}
        <div className={styles.backContainer}>
          <Link to="/" className={styles.backLink}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
