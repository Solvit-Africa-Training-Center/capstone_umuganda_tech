import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from './store';
import { initializeAuth } from './store/authSlice';
import NotFound from './pages/NotFound';
import LandingPage from './pages/Home';
import ScrollToAnchor from './components/ScrollToAnchor';
import NavBar from './components/NavBar';
import Footer from "./components/landingPage/Footer"
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import OtpVerification from './components/OtpVerification';
import Dashboard from './components/Dashboard';
import ProjectsDiscovery from './components/ProjectsDiscovery';
import CommunityPosts from './components/CommunityPosts';
import UserProfile from './components/UserProfile';
import UserManagement from './components/UserManagement';
import ImpactAchievements from './components/ImpactAchievements';
import QRScanner from './components/QRScanner';
import PendingApproval from './pages/PendingApproval';

// Leader Components
import LeaderDashboard from './components/LeaderDashboard';
import CreateProject from './components/CreateProject';
import EditProject from './components/EditProject';
import MyProjects from './components/MyProjects';
import ProjectAttendance from './components/ProjectAttendance';
import ProjectManagement from './components/ProjectManagement';
import ProjectDetail from './components/ProjectDetail';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);
  
  console.log('🔒 ProtectedRoute Check:', {
    path: window.location.pathname,
    isAuthenticated,
    isLoading,
    hasUser: !!user,
    hasToken: !!localStorage.getItem('access_token'),
    hasUserData: !!localStorage.getItem('user_data')
  });
  
  if (isLoading) {
    console.log('⏳ Auth still loading...');
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to signin');
    return <Navigate to="/signin" replace />;
  }
  
  console.log('✅ Authentication passed, rendering protected content');
  return <>{children}</>;
};

// Leader Route Component (only accessible by leaders) - Fixed case sensitivity
const LeaderRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  // Fix case sensitivity issue - backend returns "leader" (lowercase)
  if (user?.role?.toLowerCase() !== 'leader') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// OTP Route Component (only accessible during OTP flow)
const OTPRoute = ({ children }: { children: React.ReactNode }) => {
  const { otpStep, phoneNumber, isLoading } = useSelector((state: RootState) => state.auth);
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return otpStep === 'verify' && phoneNumber ? 
    <>{children}</> : <Navigate to="/signup" replace />;
};

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    console.log('🚀 App starting, initializing auth...');
    dispatch(initializeAuth());
  }, [dispatch]);
  
  useEffect(() => {
    console.log('🔄 Auth state changed:', {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      userRole: user?.role
    });
  }, [isAuthenticated, isLoading, user]);
  
  return (
    <Router>
      <ScrollToAnchor />
      <Routes>
      {/* Public routes with layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>
      
      {/* Protected routes with layout */}
      <Route element={<Layout />}>
        <Route path="/projects" element={
          <ProtectedRoute>
            <ProjectsDiscovery />
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <CommunityPosts />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Auth routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      
      <Route path="/otp-verification" element={
        <OTPRoute>
          <OtpVerification />
        </OTPRoute>
      } />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      
      <Route path="/members" element={
        <ProtectedRoute>
          <UserManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/impact" element={
        <ProtectedRoute>
          <ImpactAchievements />
        </ProtectedRoute>
      } />
      
      <Route path="/qr-scanner" element={
        <ProtectedRoute>
          <QRScanner />
        </ProtectedRoute>
      } />
      
      {/* Leader-only routes */}
      <Route path="/leader-dashboard" element={
        <LeaderRoute>
          <LeaderDashboard />
        </LeaderRoute>
      } />
      
      <Route path="/create-project" element={
        <LeaderRoute>
          <CreateProject />
        </LeaderRoute>
      } />
      
      <Route path="/my-projects" element={
        <LeaderRoute>
          <MyProjects />
        </LeaderRoute>
      } />
      
      <Route path="/project/:projectId/edit" element={
        <LeaderRoute>
          <EditProject />
        </LeaderRoute>
      } />
      
      <Route path="/project/:projectId/attendance" element={
        <LeaderRoute>
          <ProjectAttendance />
        </LeaderRoute>
      } />
      
      {/* Shared project routes */}
      <Route path="/project/:projectId" element={
        <ProtectedRoute>
          <ProjectDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/project/:projectId/qr" element={
        <LeaderRoute>
          <ProjectAttendance />
        </LeaderRoute>
      } />
      
      {/* Fallback routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
  );
};

export default App;