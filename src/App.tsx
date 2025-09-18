import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import NotFound from './pages/NotFound';
import LandingPage from './pages/Home';
import ScrollToAnchor from './components/ScrollToAnchor';
import NavBar from './components/NavBar';
import Footer from "./components/landingPage/Footer";
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
import CompleteRegistration from './pages/CompleteRegistration';
import VolunteerDashboard from './components/volunteerDashboard/VolunteerDashboard';
import VolunteerCheckIn from './components/volunteerDashboard/VolunteerCheckIn';
import VolunteerCommunityHub from './components/volunteerDashboard/VolunteerCommunityHub';
import VolunteerSettings from './components/volunteerDashboard/VolunteerSettings';
import VolunteerSideBar from './components/volunteerDashboard/volunteerSideBar';
import Sidebar from './components/LeaderDashboard/Sidebar';

const Layout = () => (
  <>
    <NavBar />
    <Outlet />
    <Footer />
  </>
);

const VolunteerLayout = () => {
  return (
    <div className="flex">
      <VolunteerSideBar currentPage="dashboard" setCurrentPage={() => {}} />
      <Outlet />
    </div>
  );
};

const LeaderLayout = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-grow">
      <Outlet />
    </div>
  </div>
);

const App = () => (
  <Provider store={store}>
    <Router>
      <ScrollToAnchor />
      <Routes>
        {/* Public / landing / auth */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
         <Route path="signup" element={<SignUpPage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="otp-verification" element={<OtpVerifyPage />} />
          <Route path="complete-registration" element={<CompleteRegistration />} />
          <Route path="leader_post" element={<LeaderInfo />} />
          <Route path="Volunteer-signup" element={<Volunteerinfo />} />

        {/* Volunteer related, nested under volunteer */}
        <Route path="volunteer/*" element={<VolunteerLayout />}>
          <Route index element={<VolunteerDashboard volunteerName="John Doe" />} />
          <Route path="check-in" element={<VolunteerCheckIn />} />
          <Route path="community-hub" element={<VolunteerCommunityHub />} />
          <Route
            path="settings"
            element={
              <VolunteerSettings
                volunteer={{
                  id: "1",
                  firstName: "Joh",
                  lastName: "Doe",
                  name: "John Doe",
                  email: "john@example.com",
                  phone: "+250123456789",
                  address: "Kigali, Rwanda",
                  organization: "UmugandaTech",
                }}
                onLogout={() => console.log("Logout")}
              />
            }
          />
        </Route>

        {/* Leader related */}
        <Route path="leader/*" element={<LeaderLayout />}>
          <Route index element={<LeaderDashboard />} />
          <Route path="projects" element={<Projectmanagement />} />
          <Route path="ai-advisor" element={<Advisor_ai />} />
          <Route path="live-dashboard" element={<Participant />} />
          <Route path="reporting" element={<Report />} />
          <Route
            path="settings"
            element={
              <VolunteerSettings
                volunteer={{
                  id: "1",
                  firstName: "Joh",
                  lastName: "Doe",
                  name: "John Doe",
                  email: "john@example.com",
                  phone: "+250123456789",
                  address: "Kigali, Rwanda",
                  organization: "UmugandaTech",
                }}
                onLogout={() => console.log("Logout")}
              />
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
