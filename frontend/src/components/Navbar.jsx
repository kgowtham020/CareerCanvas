import { useContext, useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { AuthContext } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu as MenuIcon, X, FileText, Bot, Mic, Briefcase, Settings, LogOut, UserCircle } from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';

const navItems = [
  { label: 'Resumes', path: '/resumes', icon: <FileText size={20} />, tooltip: 'Free for Students' },
  { label: 'ATS Analyzer', path: '/ats-analyzer', icon: <Bot size={20} />, tooltip: 'Free for Students' },
  { label: 'Interview Prep', path: '/interview-prep', icon: <Mic size={20} />, tooltip: 'Free for Students' },
  { label: 'Job Portal', path: '/job-portal', icon: <Briefcase size={20} />, tooltip: 'Explore Jobs' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const firstMenuItemRef = useRef(null);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  }, [logout, navigate]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
    // Set focus to first menu item after a slight delay to ensure DOM is ready
    setTimeout(() => firstMenuItemRef.current?.focus(), 100);
  }, []);

  // Manage focus trapping and body scroll
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (isMobileMenuOpen && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.key === 'Tab') {
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore body scroll
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  const navLinkVariants = {
    hover: { scale: 1.05, rotateX: 5, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, type: 'spring', stiffness: 200 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } },
  };

  const mobileMenuVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 400, damping: 40 } },
    exit: { x: '-100%', transition: { type: 'spring', stiffness: 400, damping: 40 } },
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:flex w-full h-16 bg-surface/60 backdrop-blur-lg border-b border-muted/20 px-4 sm:px-6 lg:px-8 items-center justify-between z-50 relative" aria-label="Main navigation">
        <style jsx>{`
          .particle-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 2px 2px, #334155 1px, transparent 0);
            background-size: 50px 50px;
            opacity: 0.08;
            z-index: -1;
          }
        `}</style>
        <div className="particle-bg" />
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Logo & Nav Links */}
          <div className="flex items-center gap-12">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(56,189,248,0.4)' }}
              transition={{ duration: 0.3 }}
            >
              <NavLink to="/" className="flex items-center gap-2" aria-label="CareerCanvas Home">
                {logo ? <img src={logo} alt="" className="h-9 w-9" /> : <span className="h-9 w-9 bg-accent/20 rounded-full" />}
                <span className="font-extrabold text-xl text-text-primary bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                  CareerCanvas
                </span>
              </NavLink>
            </motion.div>
            <div className="flex items-center gap-3" role="menubar">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover="hover"
                  whileTap="tap"
                  variants={navLinkVariants}
                  className="relative group"
                  role="none"
                >
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `relative px-4 py-2 text-base font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                        isActive ? 'text-text-primary' : 'text-text-secondary hover:bg-accent/20'
                      }`
                    }
                    role="menuitem"
                    aria-label={item.label}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2">
                          {item.icon}
                          {item.label}
                        </div>
                        {isActive && (
                          <motion.div
                            className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-accent to-accent/70"
                            layoutId="activeIndicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-medium text-text-primary bg-surface/70 backdrop-blur-md border border-muted/20 rounded-md" role="tooltip">
                          {item.tooltip}
                        </div>
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User Dropdown */}
          <HeadlessMenu as="div" className="relative">
            <HeadlessMenu.Button
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors rounded-full p-1 pr-3 bg-surface/50 backdrop-blur-sm border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="User menu"
              aria-haspopup="true"
            >
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-accent/70 flex items-center justify-center font-bold text-text-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(56,189,248,0.5)' }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || <UserCircle size={20} />}
              </motion.div>
              <span className="text-base font-semibold hidden xl:inline">{user?.name || 'User'}</span>
            </HeadlessMenu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 mt-2 w-60 origin-top-right rounded-lg bg-surface/70 backdrop-blur-lg border border-muted/20 shadow-[0_0_20px_rgba(0,0,0,0.3)] focus:outline-none" role="menu">
                <div className="p-2">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <motion.button
                        onClick={() => navigate('/settings')}
                        className={`${
                          active ? 'bg-accent/30 text-text-primary' : 'text-text-secondary hover:text-text-primary'
                        } group flex w-full items-center rounded-md px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-accent`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        role="menuitem"
                        aria-label="Settings & Profile"
                      >
                        <Settings className="mr-2 h-5 w-5" aria-hidden="true" />
                        Settings & Profile
                      </motion.button>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <motion.button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-red-600/30 text-text-primary' : 'text-text-secondary hover:text-text-primary'
                        } group flex w-full items-center rounded-md px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-accent`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        role="menuitem"
                        aria-label="Logout"
                      >
                        <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                        Logout
                      </motion.button>
                    )}
                  </HeadlessMenu.Item>
                </div>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-surface/60 backdrop-blur-lg border-b border-muted/20 z-50 relative" aria-label="Mobile header">
        <style jsx>{`
          .particle-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 2px 2px, #334155 1px, transparent 0);
            background-size: 50px 50px;
            opacity: 0.08;
            z-index: -1;
          }
        `}</style>
        <div className="particle-bg" />
        <motion.div
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(56,189,248,0.4)' }}
          transition={{ duration: 0.3 }}
        >
          <NavLink to="/" className="flex items-center gap-2" aria-label="CareerCanvas Home">
            {logo ? <img src={logo} alt="" className="h-9 w-9" /> : <span className="h-9 w-9 bg-accent/20 rounded-full" />}
            <span className="font-extrabold text-lg text-text-primary bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
              CareerCanvas
            </span>
          </NavLink>
        </motion.div>
        <motion.button
          ref={menuButtonRef}
          onClick={openMobileMenu}
          className="text-text-primary p-2 rounded-lg hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MenuIcon size={28} />
        </motion.button>
      </header>

      {/* Mobile Off-canvas Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div
              onClick={closeMobileMenu}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              ref={mobileMenuRef}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative z-50 w-80 h-full bg-surface/70 backdrop-blur-lg p-6 border-r border-muted/20"
            >
              <div className="flex items-center justify-between mb-8">
                <NavLink to="/" onClick={closeMobileMenu} className="flex items-center gap-2" aria-label="CareerCanvas Home">
                  {logo ? <img src={logo} alt="" className="h-9 w-9" /> : <span className="h-9 w-9 bg-accent/20 rounded-full" />}
                  <span className="font-extrabold text-lg text-text-primary bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                    CareerCanvas
                  </span>
                </NavLink>
                <motion.button
                  onClick={closeMobileMenu}
                  className="text-text-primary p-2 rounded-lg hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Close menu"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <X size={28} />
                </motion.button>
              </div>
              <nav className="flex flex-col gap-3" role="menu">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    role="none"
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                          isActive
                            ? 'bg-gradient-to-r from-accent to-accent/70 text-text-primary'
                            : 'text-text-secondary hover:bg-accent/20'
                        }`
                      }
                      role="menuitem"
                      aria-label={item.label}
                      ref={index === 0 ? firstMenuItemRef : null}
                    >
                      {item.icon}
                      <div>
                        {item.label}
                        <p className="text-xs text-text-muted">{item.tooltip}</p>
                      </div>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="border-t border-muted/20 my-6"></div>
              <nav className="flex flex-col gap-3" role="menu">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  role="none"
                >
                  <NavLink
                    to="/settings"
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                        isActive
                          ? 'bg-gradient-to-r from-accent to-accent/70 text-text-primary'
                          : 'text-text-secondary hover:bg-accent/20'
                      }`
                    }
                    role="menuitem"
                    aria-label="Settings & Profile"
                  >
                    <Settings size={20} />
                    Settings & Profile
                  </NavLink>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  role="none"
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-base font-semibold rounded-lg text-text-secondary hover:bg-red-600/30 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    role="menuitem"
                    aria-label="Logout"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </motion.div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;