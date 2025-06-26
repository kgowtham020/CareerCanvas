import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import logo from './assets/logo.svg';  // this loads your SVG
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ResumesPage from './pages/ResumesPage';
import JobPortalPage from './pages/JobPortalPage';
import ATSAnalyzerPage from './pages/ATSAnalyzerPage';
import EditorPage from './pages/EditorPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import CommunityHubPage from './pages/CommunityHubPage';
import AboutUs from './pages/AboutUs';
import OurTeam from './pages/OurTeam';
import Careers from './pages/Careers';
import Blog from './pages/Blog';

import { useEffect } from 'react';

function App() {
  const location = useLocation();

  useEffect(() => {
    console.log('Current route:', location.pathname);
  }, [location]);
  

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e2a44',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {/* Only wrap routes you want to animate */}
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/team" element={<OurTeam />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="resumes" element={<ResumesPage />} />
            <Route path="ats-analyzer" element={<ATSAnalyzerPage />} />
            <Route path="interview-prep" element={<InterviewPrepPage />} />
            <Route path="job-portal" element={<JobPortalPage />} />
            <Route path="community-hub" element={<CommunityHubPage />} />
            <Route path="editor/:resumeId" element={<EditorPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}


export default App;
