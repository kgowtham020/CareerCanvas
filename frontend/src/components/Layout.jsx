import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-background text-text-primary flex flex-col overflow-x-hidden">
      {/* Animated Gradient Background */}
      <style jsx>{`
        .gradient-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          opacity: 0.15;
          z-index: -1;
          animation: gradientShift 20s ease infinite alternate;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .mesh-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 2px 2px, #334155 1px, transparent 0);
          background-size: 40px 40px;
          opacity: 0.1;
          z-index: -1;
          animation: meshPan 30s linear infinite;
        }
        @keyframes meshPan {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
      `}</style>
      <div className="gradient-bg"></div>
      <div className="mesh-overlay"></div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Toaster Notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
            },
          }}
        />

        {/* Sticky Navbar */}
        <header className="sticky top-0 z-50 bg-surface/50 backdrop-blur-md border-b border-muted/30">
          <Navbar />
        </header>

        {/* Main Content Area */}
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="min-h-[calc(100vh-200px)]"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Sticky Footer */}
        <footer className="flex-shrink-0 bg-surface/50 backdrop-blur-md border-t border-muted/30">
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default Layout;