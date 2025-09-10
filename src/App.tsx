import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LandingPage from './pages/Home';
import ScrollToAnchor from './components/ScrollToAnchor';
import NavBar from './components/NavBar';
import Footer from "./components/landingPage/Footer"
import SignUpPage from './pages/SignUpPage';
import OtpVerifyPage from './pages/OtpVerifyPage';
import LeaderInfo from './pages/LeaderInfo';
import Signupsuccess from './pages/Signupsuccess';


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
      <Route path="/otp-verification" element={<OtpVerifyPage />} />
      <Route path="/signup-success" element={<Signupsuccess />} />
      <Route path="/leader_post" element={<LeaderInfo />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;