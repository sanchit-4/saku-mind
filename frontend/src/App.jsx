import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext/AuthContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home/Home';
import WhatWeDo from './pages/WhatWeDo/WhatWeDo';
import SakuAhead from './pages/SakuAhead/SakuAhead';
import Login from './pages/Login/Login';
import AboutUs from './pages/AboutUs/AboutUs';
import Blog from './pages/Blog/Blog';
import Onboarding from './pages/Onboarding/Onboarding';
import Dashboard from './pages/Dashboard/Dashboard';
import Admin from './pages/Admin/Admin';

// Route guard: requires auth
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/secure-login" />;
};

// Route guard: redirects logged-in users (checks onboarding first)
const PublicRoute = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  if (!currentUser) return children;
  // If user needs onboarding, go there instead of dashboard
  if (userProfile && userProfile.needsOnboarding) {
    return <Navigate to="/onboarding" />;
  }
  return <Navigate to="/dashboard" />;
};

// Route guard: dashboard — redirect to onboarding if needed
const DashboardRoute = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  if (!currentUser) return <Navigate to="/secure-login" />;
  if (userProfile && userProfile.needsOnboarding) {
    return <Navigate to="/onboarding" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/saku-ahead" element={<SakuAhead />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/saku-blog" element={<Blog />} />
          
          {/* Admin Panel */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Auth Pages (Restricted if already logged in) */}
          <Route path="/secure-login" element={<PublicRoute><Login /></PublicRoute>} />
          
          {/* Protected Pages */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<DashboardRoute><Dashboard /></DashboardRoute>} />
          
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
