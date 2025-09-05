import { BrowserRouter as Router, Routes, Route,Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import LandingPage from './pages/Home';
import Projects from './pages/Projects';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Footer from "./components/landingPage/Footer"
import Signupsuccess from './pages/Signupsuccess';
import LeaderInfo from './pages/LeaderInfo';




function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    <Footer />

    </>
  );
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about_us" element={<About />} />
          <Route path="/how_it_works" element={<HowItWorks />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
        <Route path="/success" element={<Signupsuccess/>} />
        <Route path="/leader_info" element={<LeaderInfo/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
