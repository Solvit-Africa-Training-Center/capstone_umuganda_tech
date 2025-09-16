import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LandingPage from './pages/Home';
import ScrollToAnchor from './components/ScrollToAnchor';
import NavBar from './components/NavBar';
import Footer from "./components/landingPage/Footer"
import SignUpPage from './pages/SignUpPage';
import OtpVerifyPage from './pages/OtpVerifyPage';
import LeaderInfo from './pages/LeaderInfo';
import Volunteerinfo from './components/landingPage/Volunteerinfo';
import Advisor_ai from './pages/Advisor_ai';
import Report from './pages/Report';
import Projectmanagement from './pages/Projectmanagement';
import Participant from './pages/Participant';
import LeaderDashboard from './pages/Dashboard';
import SignInPage from './pages/SignInPage';
import VolunteerDashboard from './components/volunteerDashboard/VolunteerDashboard';
import VolunteerCheckIn from './components/volunteerDashboard/VolunteerCheckIn';
import VolunteerCommunityHub from './components/volunteerDashboard/VolunteerCommunityHub';
import VolunteerSettings from './components/volunteerDashboard/VolunteerSettings';
import VolunteerSideBar from './components/volunteerDashboard/volunteerSideBar';


const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    <Footer />

    </>
  );
}

const VolunteerLayout = () => {
  return (
    <div className="flex">
      <VolunteerSideBar currentPage="dashboard" setCurrentPage={() => {}} />
      <Outlet />
    </div>
  );
};


const App = () => (
  <Router>
    <ScrollToAnchor />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/otp-verification" element={<OtpVerifyPage />} />
      <Route path="/leader_post" element={<LeaderInfo />} />
      <Route path="/leader" element={<LeaderDashboard />} />
      {/* Volunteer Routes */}
      <Route path="/volunteer/*" element={<VolunteerLayout />}>
        <Route index element={<VolunteerDashboard volunteerName="John Doe" />} />
        <Route path="check-in" element={<VolunteerCheckIn />} />
        <Route path="community-hub" element={<VolunteerCommunityHub />} />
        <Route path="settings" element={
        <VolunteerSettings 
          volunteer={{
          id: "1",
          firstName: "Joh",
          lastName: "Doe",
          name: "John Doe",
          email: "john@example.com", 
          phone: "+250123456789",
          address: "Kigali, Rwanda",
          organization: "UmugandaTech"
          }}
         onLogout={() => console.log('Logout')}
        />
       } />
      </Route>

      <Route path="/Volunteer-signup" element={<Volunteerinfo />} />
      <Route path="/Advisor-ai" element={<Advisor_ai/>} />
      <Route path="/Report" element={<Report/>} />
      <Route path="/Report" element={<Report/>} />
      <Route path="/projectmanagement" element={<Projectmanagement/>} />
       <Route path="/participant" element={<Participant/>} />
      <Route path="/leader_dashboard" element={<LeaderDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;