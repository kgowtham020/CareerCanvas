import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Command } from 'cmdk';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Home, FileText, Bot, Mic, Settings, LogOut, CheckCircle, Users, Search, Briefcase } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// Interactive Orb Component
const InteractiveOrb = () => (
  <div className="w-full h-full flex items-center justify-center min-h-[320px] md:min-h-[400px]">
    <motion.div
      className="relative w-60 h-60 md:w-72 md:h-72"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/30 to-transparent"
        style={{ filter: 'blur(16px)', opacity: 0.7 }}
        animate={{ scale: [1, 1.02, 1], rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-6 bg-surface/60 backdrop-blur-lg rounded-full border border-muted/20 shadow-inner"
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/10 rounded-full" />
      </motion.div>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          animate={{ rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute w-2 h-2 bg-accent rounded-full opacity-50"
            style={{ top: `${10 + i * 15}%`, left: `${50 - i * 5}%` }}
          />
        </motion.div>
      ))}
    </motion.div>
  </div>
);

// Chart Data
const chartData = [
  { name: 'Initial Score', score: 65, color: '#475569' },
  { name: 'After AI Edit', score: 92, color: '#38bdf8' },
];

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openCommandPalette, setOpenCommandPalette] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommandPalette((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command) => {
    command();
    setOpenCommandPalette(false);
  };

  const FeatureCard = ({ icon, title, text, onClick, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-xl p-6 text-center flex flex-col items-center hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      whileHover={{ scale: 1.03, rotateZ: 1 }}
    >
      <motion.div
        className="bg-gradient-to-r from-accent/20 to-accent/40 p-4 rounded-lg text-accent mb-4"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>
      <h3 className="font-semibold text-xl text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary mt-2">{text}</p>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 relative">
      {/* Background Particle Mesh */}
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
          animation: particlePan 40s linear infinite;
        }
        @keyframes particlePan {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
      `}</style>
      <div className="particle-bg" />

      {/* Command Palette */}
      <Command.Dialog
        open={openCommandPalette}
        onOpenChange={setOpenCommandPalette}
        label="Global Command Palette"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-surface/70 backdrop-blur-lg border border-muted/20 rounded-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        >
          <Command.Input
            placeholder="Search or type a command..."
            className="w-full px-4 py-3 text-base font-medium text-text-primary bg-surface/30 border border-muted/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/30"
            aria-label="Search commands"
          />
          <Command.List className="mt-4 max-h-[300px] overflow-auto">
            <Command.Empty className="text-text-secondary text-sm text-center py-3">No results found.</Command.Empty>
            <Command.Group heading="Navigate" className="text-text-muted font-semibold text-xs px-3 py-2 uppercase">
              {[
                { label: 'Go to Home', path: '/', icon: <Home className="h-4 w-4" /> },
                { label: 'Go to Resumes', path: '/resumes', icon: <FileText className="h-4 w-4" /> },
                { label: 'Go to ATS Analyzer', path: '/ats-analyzer', icon: <Bot className="h-4 w-4" /> },
                { label: 'Go to Interview Prep', path: '/interview-prep', icon: <Mic className="h-4 w-4" /> },
                { label: 'Go to Settings', path: '/settings', icon: <Settings className="h-4 w-4" /> },
              ].map((item, index) => (
                <Command.Item
                  key={item.path}
                  onSelect={() => runCommand(() => navigate(item.path))}
                  className="flex items-center gap-3 px-4 py-2 text-text-primary hover:bg-accent/30 rounded-md cursor-pointer"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.icon}
                  </motion.div>
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Actions" className="text-text-muted font-semibold text-xs px-3 py-2 uppercase">
              <Command.Item
                onSelect={() => runCommand(logout)}
                className="flex items-center gap-3 px-4 py-2 text-text-primary hover:bg-red-600/30 rounded-md cursor-pointer"
              >
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <LogOut className="h-4 w-4" />
                </motion.div>
                Logout
              </Command.Item>
            </Command.Group>
          </Command.List>
        </motion.div>
      </Command.Dialog>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-text-primary leading-tight"
          >
            Shape Your <br />
            <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">Career</span> Future
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-text-secondary max-w-xl"
          >
            CareerCanvas empowers students with free, AI-driven tools to craft resumes, ace interviews, and land dream jobs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <motion.button
              onClick={() => navigate('/resumes')}
              className="px-8 py-4 bg-gradient-to-r from-accent to-accent/70 text-text-primary font-semibold rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(56,189,248,0.8)' }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <p className="text-sm text-text-secondary flex items-center gap-2">
              Try{' '}
              <kbd className="px-2 py-1 text-xs font-semibold text-text-primary bg-surface/50 backdrop-blur-sm border border-muted/20 rounded-md">
                Cmd + K
              </kbd>
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <InteractiveOrb />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary">All-in-One Career Tools</h2>
          <p className="text-base text-text-secondary max-w-2xl mx-auto">
            From resumes to interviews, our AI-powered platform has you covered.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[
            {
              icon: <FileText size={32} />,
              title: 'Resume Builder',
              text: 'Create ATS-friendly resumes with stunning templates.',
              path: '/resumes',
            },
            {
              icon: <Bot size={32} />,
              title: 'ATS Analyzer',
              text: 'Optimize your resume with AI-driven insights.',
              path: '/ats-analyzer',
            },
            {
              icon: <Mic size={32} />,
              title: 'Interview Coach',
              text: 'Master interviews with real-time AI feedback.',
              path: '/interview-prep',
            },
          ].map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              text={feature.text}
              onClick={() => navigate(feature.path)}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4 lg:order-2"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary">Skyrocketing Results</h2>
          <p className="text-base text-text-secondary max-w-lg">
            Boost your resume’s ATS score and stand out to recruiters with our AI tools.
          </p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 text-text-secondary"
          >
            <CheckCircle size={24} className="text-accent" />
            <span className="text-base">92% average ATS score improvement</span>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-xl p-8 h-[320px] shadow-[0_0_20px_rgba(0,0,0,0.3)]"
        >
          <h4 className="text-center font-semibold text-xl text-text-primary mb-4">ATS Score Impact</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={14} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={14} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(71, 85, 105, 0.15)' }}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  padding: '8px',
                }}
              />
              <Bar dataKey="score" name="ATS Score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index})`}
                  />
                ))}
              </Bar>
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.4} />
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* Why CareerCanvas Showcase */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary">Why CareerCanvas?</h2>
          <p className="text-base text-text-secondary max-w-2xl mx-auto">
            Discover why students choose our free, AI-powered platform to kickstart their careers.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 relative">
          <style jsx>{`
            .wave-bg {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 50%, rgba(56,189,248,0.1) 100%);
              opacity: 0.15;
              z-index: -1;
              animation: wavePulse 10s ease-in-out infinite;
            }
            @keyframes wavePulse {
              0% { transform: translateX(-10%); }
              50% { transform: translateX(10%); }
              100% { transform: translateX(-10%); }
            }
          `}</style>
          <div className="wave-bg" />
          {[
            {
              icon: <Bot size={32} />,
              title: 'Free ATS Tools',
              text: 'Optimize your resume for any job with AI-driven analysis, free for students.',
            },
            {
              icon: <FileText size={32} />,
              title: 'Resume Builder',
              text: 'Craft ATS-friendly resumes with professional templates in minutes.',
            },
            {
              icon: <Mic size={32} />,
              title: 'Interview Prep',
              text: 'Practice with AI-powered mock interviews to build confidence.',
            },
            {
              icon: <Users size={32} />,
              title: 'Student-Focused',
              text: 'Built for students, free forever, no hidden costs.',
            },
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, scale: 0.9, rotateZ: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-xl p-6 flex flex-col items-center hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:-translate-y-2 transition-all duration-500"
              whileHover={{ scale: 1.03, rotateZ: 2 }}
            >
              <motion.div
                className="bg-gradient-to-r from-accent/20 to-accent/40 p-4 rounded-lg text-accent mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {benefit.icon}
              </motion.div>
              <h3 className="font-semibold text-xl text-text-primary">{benefit.title}</h3>
              <p className="text-sm text-text-secondary mt-2">{benefit.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Student Journey Timeline */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary">Your Journey to Success</h2>
          <p className="text-base text-text-secondary max-w-2xl mx-auto">
            Follow these steps to go from student to star employee with CareerCanvas’s free tools.
          </p>
        </motion.div>
        <div className="relative mt-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <style jsx>{`
            .timeline-line {
              position: absolute;
              background: linear-gradient(to right, transparent, #38bdf8, transparent);
              z-index: -1;
            }
            .timeline-line.vertical {
              left: 50%;
              transform: translateX(-50%);
              width: 4px;
              height: 100%;
            }
            .timeline-line.horizontal {
              top: 50%;
              transform: translateY(-50%);
              height: 4px;
              width: 100%;
            }
            .pulse {
              animation: pulse 3s ease-in-out infinite;
            }
            @keyframes pulse {
              0% { opacity: 0.3; }
              50% { opacity: 0.8; }
              100% { opacity: 0.3; }
            }
          `}</style>
          <div className="timeline-line vertical lg:horizontal pulse" />
          {[
            {
              icon: <Search size={28} />,
              title: 'Discover CareerCanvas',
              text: 'Find our free tools for students.',
            },
            {
              icon: <FileText size={28} />,
              title: 'Build Your Resume',
              text: 'Use our AI-powered resume builder.',
            },
            {
              icon: <Bot size={28} />,
              title: 'Optimize with ATS',
              text: 'Boost your score with free analysis.',
            },
            {
              icon: <Mic size={28} />,
              title: 'Ace Interviews',
              text: 'Practice with AI mock interviews.',
            },
            {
              icon: <Briefcase size={28} />,
              title: 'Land Your Job',
              text: 'Get hired with confidence!',
            },
          ].map((milestone, index) => (
            <motion.div
              key={milestone.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2, type: 'spring', stiffness: 200 }}
              viewport={{ once: true }}
              className="flex flex-col items-center w-full lg:w-auto"
            >
              <motion.div
                className="bg-surface/60 backdrop-blur-lg border border-muted/20 rounded-full p-4 mb-4 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {milestone.icon}
              </motion.div>
              <h3 className="font-semibold text-lg text-text-primary">{milestone.title}</h3>
              <p className="text-sm text-text-secondary mt-1 max-w-[200px] text-center">{milestone.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;