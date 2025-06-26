import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { Player } from '@lottiefiles/react-lottie-player';

const quotes = [
  { text: "Your career is your canvas; paint it boldly.", author: "CareerCanvas" },
  { text: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
];

const AnimatedIllustration = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isImageError, setIsImageError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="w-full h-full bg-surface rounded-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden backdrop-blur-xl border border-muted/30"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-background bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.15),transparent_50%)] animate-background-pan" />
      
      {/* Lottie Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-48 h-48 mb-6"
      >
        {isImageError ? (
          <div className="w-full h-full bg-accent/20 rounded-full flex items-center justify-center">
            <span className="text-text-primary text-3xl font-bold">CC</span>
          </div>
        ) : (
          <Player
            autoplay
            loop
            src="/animations/career-animation.json"
            style={{ height: '100%', width: '100%' }}
            onError={() => setIsImageError(true)}
          />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl font-bold text-text-primary">CareerCanvas</h1>
        <p className="text-text-secondary mt-3 text-lg max-w-md">
          Craft stunning resumes and track your job applications with ease. Your path to success starts here.
        </p>
      </motion.div>
      
      <AnimatePresence>
        <motion.div
          className="absolute bottom-6 text-center text-text-secondary px-4"
          key={currentQuoteIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm italic">"{quotes[currentQuoteIndex].text}"</p>
          <p className="text-xs mt-1">— {quotes[currentQuoteIndex].author}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register, user } = useContext(AuthContext) || {};

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!login || !register) {
      toast.error('Authentication service is unavailable. Please try again later.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await register(name, email, password);
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        await login(email, password);
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast.success("Google Sign-In is coming soon!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-surface/50 backdrop-blur-xl border border-muted/30 p-8 rounded-2xl shadow-2xl">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-text-primary">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="mt-2 text-text-secondary">
                {isSignUp ? 'Join CareerCanvas to shape your future.' : 'Sign in to your dashboard.'}
              </p>
            </motion.div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="text-sm font-medium text-text-secondary">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full p-3 bg-background border border-muted rounded-lg text-text-primary placeholder-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-40 transition-all duration-300"
                      placeholder="Enter your full name"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-sm font-medium text-text-secondary">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full p-3 bg-background border border-muted rounded-lg text-text-primary placeholder-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-40 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full p-3 bg-background border border-muted rounded-lg text-text-primary placeholder-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-40 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-text-primary font-semibold bg-accent hover:bg-accent-hover transition-all duration-300 disabled:bg-muted disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : isSignUp ? (
                  <>
                    <UserPlus size={18} /> Sign Up
                  </>
                ) : (
                  <>
                    <LogIn size={18} /> Sign In
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-transparent text-text-secondary">OR</span>
                </div>
              </div>
              <motion.button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 mt-6 rounded-lg bg-surface text-text-primary font-medium hover:bg-accent/20 transition-colors duration-300 border border-muted"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FcGoogle size={22} /> Sign {isSignUp ? 'up' : 'in'} with Google
              </motion.button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-text-secondary">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-semibold text-accent hover:text-accent-hover ml-2 transition-colors duration-200"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatedIllustration />
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;