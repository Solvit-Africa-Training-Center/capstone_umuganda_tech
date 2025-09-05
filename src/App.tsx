import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LandingPage from './pages/Home';
import ScrollToAnchor from './components/ScrollToAnchor';
import NavBar from './components/NavBar';
import Footer from "./components/landingPage/Footer"

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
        {/* other routes */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
