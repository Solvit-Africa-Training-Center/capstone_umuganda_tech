# Routing Setup for Leader Dashboard

## Required Routes

Add these routes to your main routing file (App.tsx or router configuration):

```typescript
// In App.tsx or your router setup
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeaderDashboard from './components/LeaderDashboard';
import CreateProject from './components/CreateProject';
import MyProjects from './components/MyProjects';
import ProjectManagement from './components/ProjectManagement';
import ProjectDetail from './components/ProjectDetail';
import ProjectAttendance from './components/ProjectAttendance';
import QRGenerator from './components/QRGenerator';
import CommunityPosts from './components/CommunityPosts';
import UserManagement from './components/UserManagement';
import NotificationCenter from './components/NotificationCenter';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leader-dashboard" element={<LeaderDashboard />} />
        
        {/* Project management routes */}
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        <Route path="/project/:projectId/edit" element={<ProjectManagement />} />
        <Route path="/project/:projectId/attendance" element={<ProjectAttendance />} />
        <Route path="/project/:projectId/qr" element={<QRGenerator />} />
        <Route path="/project/:projectId/volunteers" element={<ProjectVolunteers />} />
        
        {/* Community and user routes */}
        <Route path="/community" element={<CommunityPosts />} />
        <Route path="/volunteers" element={<UserManagement />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/profile" element={<UserProfile />} />
        
        {/* Analytics routes */}
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/attendance" element={<AttendanceReports />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
```

## Missing Components to Create

### 1. ProjectVolunteers Component
```typescript
// src/components/ProjectVolunteers.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI } from '../api/projects';

const ProjectVolunteers: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [volunteers, setVolunteers] = useState([]);
  
  useEffect(() => {
    if (projectId) {
      fetchProjectVolunteers();
    }
  }, [projectId]);
  
  const fetchProjectVolunteers = async () => {
    try {
      const data = await projectsAPI.getProjectRegistrations(Number(projectId));
      setVolunteers(data.registrations || []);
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Project Volunteers</h1>
        {/* Volunteer list implementation */}
      </div>
    </div>
  );
};

export default ProjectVolunteers;
```

### 2. Analytics Component
```typescript
// src/components/Analytics.tsx
import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
        {/* Analytics implementation */}
      </div>
    </div>
  );
};

export default Analytics;
```

### 3. AttendanceReports Component
```typescript
// src/components/AttendanceReports.tsx
import React from 'react';

const AttendanceReports: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance Reports</h1>
        {/* Attendance reports implementation */}
      </div>
    </div>
  );
};

export default AttendanceReports;
```

## Protected Routes Setup

```typescript
// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireLeader?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireLeader = false 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  if (requireLeader && user?.role?.toLowerCase() !== 'leader') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Usage in routes:
<Route 
  path="/leader-dashboard" 
  element={
    <ProtectedRoute requireLeader>
      <LeaderDashboard />
    </ProtectedRoute>
  } 
/>
```

## Navigation Updates

Update your navigation components to include new routes:

```typescript
// In NavBar.tsx or similar
const navigationItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Projects', href: '/projects' },
  { name: 'Community', href: '/community' },
  // Leader-only items
  ...(user?.role?.toLowerCase() === 'leader' ? [
    { name: 'My Projects', href: '/my-projects' },
    { name: 'Create Project', href: '/create-project' },
    { name: 'Analytics', href: '/analytics' },
  ] : []),
];
```