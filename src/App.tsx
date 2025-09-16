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


const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    <Footer />

    </>
  );
}

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